# Red Flags & Critical Guidelines for StillWaters Development

## ⚠️ CRITICAL: Read This Before Writing Any Code

This document contains critical guidelines to prevent common but serious issues during development. These are hard-learned lessons that can save weeks of debugging and prevent production disasters.

## 🔴 Priority 0: Security & Cost Control

### API Key Management
```javascript
// ❌ NEVER DO THIS - Frontend exposure
const ChatScreen = () => {
  const response = await fetch('https://api.openai.com/v1/chat', {
    headers: { 'Authorization': 'Bearer sk-...' } // EXPOSED TO CLIENT!
  });
};

// ✅ ALWAYS DO THIS - Backend proxy
const ChatScreen = () => {
  const response = await fetch('https://ourbackend.com/api/chat', {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
};

// Backend (Node.js)
app.post('/api/chat', authenticate, rateLimit, async (req, res) => {
  const response = await openai.chat({
    apiKey: process.env.OPENAI_API_KEY // Server-side only
  });
});
```

### Rate Limiting & Cost Control
```javascript
// ❌ NEVER DO THIS - Unlimited API calls
app.post('/api/chat', async (req, res) => {
  const response = await openai.chat(req.body);
  res.json(response);
});

// ✅ ALWAYS DO THIS - Rate limited with quota
const rateLimiter = {
  free: { daily: 5, monthly: 150 },
  premium: { daily: 100, monthly: 3000 }
};

app.post('/api/chat', authenticate, async (req, res) => {
  const usage = await db.getUserUsage(req.user.id);
  const limit = rateLimiter[req.user.tier];
  
  if (usage.daily >= limit.daily) {
    return res.status(429).json({ error: 'Daily limit reached' });
  }
  
  // Add cost safeguard
  const estimatedCost = calculateCost(req.body);
  if (estimatedCost > 0.50) { // $0.50 per request max
    return res.status(400).json({ error: 'Request too large' });
  }
  
  const response = await openai.chat(req.body);
  await db.incrementUsage(req.user.id);
  res.json(response);
});
```

### Sensitive Data Storage
```javascript
// ❌ NEVER DO THIS - Plain text storage
await AsyncStorage.setItem('userPassword', password);
await AsyncStorage.setItem('journalEntry', privateThoughts);

// ✅ ALWAYS DO THIS - Encrypted storage
import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';

// For credentials
await Keychain.setInternetCredentials(
  'stillwaters',
  username,
  password
);

// For sensitive user data
const encrypted = CryptoJS.AES.encrypt(journalEntry, userKey).toString();
await AsyncStorage.setItem('journal_encrypted', encrypted);
```

## 🔴 Priority 1: Performance Killers

### List Rendering
```javascript
// ❌ NEVER DO THIS - Renders all items
const FAQList = ({ questions }) => (
  <ScrollView>
    {questions.map(q => <QuestionCard key={q.id} {...q} />)}
  </ScrollView>
);

// ✅ ALWAYS DO THIS - Virtualized list
const FAQList = ({ questions }) => (
  <FlatList
    data={questions}
    renderItem={({ item }) => <QuestionCard {...item} />}
    keyExtractor={item => item.id}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    windowSize={10}
    removeClippedSubviews={true}
    getItemLayout={(data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
  />
);
```

### Image Optimization
```javascript
// ❌ NEVER DO THIS - Unoptimized images
<Image source={{ uri: fullSizeImage }} style={{ width: 100, height: 100 }} />

// ✅ ALWAYS DO THIS - Optimized images
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: thumbnailUrl, // Use appropriate size
    priority: FastImage.priority.normal,
    cache: FastImage.cacheControl.immutable,
  }}
  style={{ width: 100, height: 100 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### useEffect Dependencies
```javascript
// ❌ NEVER DO THIS - Infinite loop
const [data, setData] = useState([]);
useEffect(() => {
  setData([...data, newItem]); // data is dependency and being modified
}, [data]); // INFINITE LOOP!

// ✅ ALWAYS DO THIS - Functional updates
useEffect(() => {
  setData(prevData => [...prevData, newItem]);
}, [newItem]); // Only depend on what actually changed
```

### Debouncing User Input
```javascript
// ❌ NEVER DO THIS - API call on every keystroke
const SearchBar = () => {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    searchAPI(query); // Called on EVERY character!
  }, [query]);
};

// ✅ ALWAYS DO THIS - Debounced API calls
import { useMemo } from 'react';
import debounce from 'lodash.debounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((q) => searchAPI(q), 500),
    []
  );
  
  useEffect(() => {
    if (query.length > 2) {
      debouncedSearch(query);
    }
  }, [query]);
};
```

## 🔴 Priority 2: Error Handling

### Network Requests
```javascript
// ❌ NEVER DO THIS - No error handling
const fetchData = async () => {
  const response = await fetch(url);
  const data = await response.json();
  setData(data.results);
};

// ✅ ALWAYS DO THIS - Comprehensive error handling
const fetchData = async () => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data.results)) {
      console.error('Invalid data structure', data);
      setError('Invalid data received');
      return;
    }
    
    setData(data.results);
  } catch (error) {
    if (error.name === 'NetworkError') {
      setError('No internet connection');
    } else if (error.name === 'TimeoutError') {
      setError('Request timed out');
    } else {
      setError('Something went wrong');
    }
    console.error('Fetch error:', error);
  } finally {
    setLoading(false);
  }
};
```

### Error Boundaries
```javascript
// ✅ ALWAYS IMPLEMENT - Error boundary for each major section
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to Sentry in production
    if (__DEV__ === false) {
      Sentry.captureException(error);
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text>Something went wrong</Text>
          <Button title="Try Again" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }
    
    return this.props.children;
  }
}

// Wrap major features
<ErrorBoundary>
  <ChatScreen />
</ErrorBoundary>
```

## 🔴 Priority 3: Database & State Management

### N+1 Query Problem
```javascript
// ❌ NEVER DO THIS - Multiple queries
const getConversations = async (userId) => {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
  const conversations = await db.query('SELECT * FROM conversations WHERE user_id = ?', [userId]);
  
  for (const conv of conversations) {
    conv.messages = await db.query('SELECT * FROM messages WHERE conversation_id = ?', [conv.id]);
  }
  
  return conversations; // This made 1 + N queries!
};

// ✅ ALWAYS DO THIS - Single query with JOIN
const getConversations = async (userId) => {
  const query = `
    SELECT 
      c.*,
      json_agg(m.*) as messages
    FROM conversations c
    LEFT JOIN messages m ON m.conversation_id = c.id
    WHERE c.user_id = ?
    GROUP BY c.id
  `;
  
  return await db.query(query, [userId]);
};
```

### Subscription State Management
```javascript
// ❌ NEVER DO THIS - Client-side only validation
const isPremium = () => {
  const subscription = AsyncStorage.getItem('subscription');
  return subscription === 'premium';
};

// ✅ ALWAYS DO THIS - Server-side validation
const checkPremiumAccess = async () => {
  try {
    const response = await fetch('/api/user/subscription', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const { isActive, expiresAt } = await response.json();
    
    if (!isActive || new Date(expiresAt) < new Date()) {
      return false;
    }
    
    // Cache for short period only
    await AsyncStorage.setItem('subscription_cache', JSON.stringify({
      isActive,
      expiresAt,
      cachedAt: Date.now()
    }));
    
    return true;
  } catch (error) {
    // Fail closed - assume not premium if can't verify
    return false;
  }
};
```

## 🔴 Priority 4: Memory Management

### Cleanup in useEffect
```javascript
// ❌ NEVER DO THIS - Memory leak
useEffect(() => {
  const timer = setInterval(updateTime, 1000);
  const subscription = EventEmitter.subscribe('event', handler);
  NetInfo.addEventListener(handleConnectivityChange);
  // NO CLEANUP!
}, []);

// ✅ ALWAYS DO THIS - Proper cleanup
useEffect(() => {
  const timer = setInterval(updateTime, 1000);
  const subscription = EventEmitter.subscribe('event', handler);
  const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
  
  return () => {
    clearInterval(timer);
    subscription.remove();
    unsubscribe();
  };
}, []);
```

### Large Data Handling
```javascript
// ❌ NEVER DO THIS - Keep everything in memory
const [allConversations, setAllConversations] = useState([]);

useEffect(() => {
  const loadAll = async () => {
    const data = await fetchAllConversations(); // Could be thousands
    setAllConversations(data);
  };
  loadAll();
}, []);

// ✅ ALWAYS DO THIS - Pagination and cleanup
const [conversations, setConversations] = useState([]);
const [page, setPage] = useState(1);

useEffect(() => {
  const load = async () => {
    const data = await fetchConversations({ page, limit: 20 });
    setConversations(prev => 
      page === 1 ? data : [...prev, ...data]
    );
  };
  load();
}, [page]);

// Clear old data when navigating away
useEffect(() => {
  return () => setConversations([]);
}, []);
```

## 🔴 Priority 5: Platform-Specific Issues

### iOS Safe Areas
```javascript
// ❌ NEVER DO THIS - Ignore safe areas
<View style={{ paddingTop: 20 }}>
  <Header />
</View>

// ✅ ALWAYS DO THIS - Respect safe areas
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Screen = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{ paddingTop: insets.top }}>
      <Header />
    </View>
  );
};
```

### Android Back Button
```javascript
// ✅ ALWAYS IMPLEMENT - Handle Android back
useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return true;
    }
    return false;
  });
  
  return () => backHandler.remove();
}, [navigation]);
```

### Keyboard Handling
```javascript
// ❌ NEVER DO THIS - Ignore keyboard
<View>
  <TextInput />
  <Button title="Submit" />
</View>

// ✅ ALWAYS DO THIS - Handle keyboard properly
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
>
  <ScrollView>
    <TextInput />
    <Button title="Submit" />
  </ScrollView>
</KeyboardAvoidingView>
```

## 🔴 Priority 6: Offline Mode

### Network-First Approach
```javascript
// ✅ IMPLEMENT PROPER OFFLINE HANDLING
import NetInfo from '@react-native-community/netinfo';

const fetchWithFallback = async (url, cacheKey) => {
  const netInfo = await NetInfo.fetch();
  
  if (netInfo.isConnected) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      // Cache for offline use
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      return data;
    } catch (error) {
      console.log('Fetch failed, trying cache');
    }
  }
  
  // Fallback to cache
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    // Warn if data is stale (> 24 hours)
    if (age > 86400000) {
      console.warn('Using stale cached data');
    }
    
    return data;
  }
  
  throw new Error('No network and no cached data');
};
```

## 🔴 Priority 7: Testing Critical Paths

### Focus Testing on What Matters
```javascript
// ✅ CRITICAL TESTS TO ALWAYS WRITE

// 1. Payment flow
describe('Premium Subscription', () => {
  it('should not allow access to premium features without payment', async () => {
    const user = await createFreeUser();
    const response = await requestPremiumFeature(user);
    expect(response.status).toBe(403);
  });
  
  it('should validate receipt before granting access', async () => {
    const fakeReceipt = 'invalid-receipt';
    const response = await validateReceipt(fakeReceipt);
    expect(response.valid).toBe(false);
  });
});

// 2. Rate limiting
describe('API Rate Limiting', () => {
  it('should enforce daily limits for free users', async () => {
    const user = await createFreeUser();
    
    for (let i = 0; i < 5; i++) {
      await makeAPICall(user);
    }
    
    const response = await makeAPICall(user);
    expect(response.status).toBe(429);
  });
});

// 3. Data integrity
describe('User Data', () => {
  it('should never expose other users data', async () => {
    const user1 = await createUser();
    const user2 = await createUser();
    
    const journal1 = await createJournalEntry(user1, 'private');
    const response = await getJournalEntry(user2, journal1.id);
    
    expect(response.status).toBe(403);
  });
});
```

## 📋 Pre-Deployment Checklist

```markdown
## Security
□ All API keys in environment variables
□ No sensitive data in console.logs
□ Encryption implemented for sensitive storage
□ Rate limiting tested and working
□ SQL injection prevention verified
□ Receipt validation implemented

## Performance
□ All lists use FlatList
□ Images are optimized and cached
□ No memory leaks detected
□ Debouncing implemented for inputs
□ Tested on low-end devices

## Error Handling
□ Error boundaries around major features
□ Network errors handled gracefully
□ Offline mode works without crashes
□ All promises have catch blocks

## Platform Specific
□ iOS safe areas respected
□ Android back button handled
□ Keyboard behavior correct on both platforms
□ Permissions requested properly

## Business Logic
□ Free users cannot access premium features
□ Subscription expiry handled correctly
□ Daily limits enforced
□ Cost safeguards in place for AI APIs
```

## 🚨 Emergency Fixes

If you discover any of these issues in production:

1. **Exposed API Keys**: Rotate immediately, push update ASAP
2. **Missing Rate Limiting**: Implement server-side immediately
3. **Payment Bypass**: Disable feature until fixed
4. **Data Leak**: Patch immediately, notify affected users
5. **Performance Crisis**: Revert to previous version, fix offline

## Remember

- **Simple > Complex**: Always choose the simpler solution
- **Test on Real Devices**: Simulators hide many issues
- **Fail Gracefully**: Users should never see crashes
- **Monitor Costs**: AI APIs can bankrupt you quickly
- **Security First**: One breach can kill your app

---
*Keep this document open while coding. Review before every commit.*