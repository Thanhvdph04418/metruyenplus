# Affiliate Link System - Implementation Guide

## 📋 Tổng Quan

Hệ thống mở affiliate link khi user **chuyển chapter** với rate limiting để tránh làm phiền.

## 🎯 Cách Hoạt Động

### Trigger Logic (Event-Driven)
1. **User action**: Trigger chỉ xảy ra khi user **click chuyển chapter** (prev/next button)
2. **Lần đầu tiên**: Sau **15 phút** kể từ lần đầu vào trang đọc truyện
   - User click chuyển chapter → Check: đã 15 phút chưa? → Nếu đủ → Mở affiliate link
3. **Các lần tiếp theo**: Sau **1 tiếng** kể từ lần trigger trước
   - User click chuyển chapter → Check: đã 1 tiếng chưa? → Nếu đủ → Mở affiliate link
4. **Không tự động**: Không có background timer, chỉ check khi user navigate

### Rate Limiting
- Dùng `localStorage` để track timestamps
- Không cần authentication
- Works cho cả anonymous và authenticated users
- Persistent across sessions

## 📁 Files Structure

```
src/
├── utils/
│   └── affiliate.ts              # Core logic & rate limiting
├── components/
│   ├── Affiliate.tsx             # Initialization component
│   └── index.ts                  # Export
├── hooks/
│   └── useChapterNavigation.ts  # Navigation integration (line 35)
└── pages/
    └── ComicsChapter.tsx         # Component mount point (line 274)
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Affiliate Configuration
VITE_AFFILIATE_URL=https://comic-aff.vercel.app
VITE_AFFILIATE_FIRST_DELAY_MS=900000   # 15 phút (15 * 60 * 1000)
VITE_AFFILIATE_REPEAT_DELAY_MS=3600000 # 1 tiếng (60 * 60 * 1000)
```

### Quick Testing (.env.test)

Để test nhanh (1 phút cho first, 2 phút cho repeat):

```env
VITE_AFFILIATE_FIRST_DELAY_MS=60000    # 1 phút
VITE_AFFILIATE_REPEAT_DELAY_MS=120000  # 2 phút
```

## 💾 localStorage Data

```typescript
{
  affiliate_first_visit: 1704067200000,      // Timestamp lần đầu vào trang đọc truyện
  affiliate_last_triggered: 1704067800000,   // Timestamp lần trigger gần nhất
  affiliate_trigger_count: 1                  // Số lần đã trigger (0 = chưa trigger)
}
```

## 🔄 User Flow Chi Tiết

### Scenario 1: User mới (lần đầu đọc truyện)
1. **T=0**: User vào trang chapter → `first_visit` timestamp được tạo
2. **T=5 min**: User click next chapter → Check: chưa đủ 15 phút → Skip affiliate
3. **T=10 min**: User click next chapter → Check: chưa đủ 15 phút → Skip affiliate
4. **T=16 min**: User click next chapter → Check: ✅ Đã 15 phút → **Mở affiliate tab**
5. `last_triggered` và `trigger_count = 1` được update

### Scenario 2: User tiếp tục đọc (sau trigger lần 1)
1. **T=20 min**: User click next chapter → Check: chưa đủ 1 tiếng → Skip affiliate
2. **T=1h 17min**: User click next chapter → Check: ✅ Đã 1 tiếng → **Mở affiliate tab**
3. `last_triggered` được update, `trigger_count = 2`

### Scenario 3: User không chuyển chapter
1. User vào trang đọc truyện, đọc xong toàn bộ chapter
2. Không click prev/next → **Không có affiliate trigger**
3. User đóng tab → Không có gì xảy ra

### Scenario 4: User browse website không đọc truyện
1. User browse Home, ComicsList, ComicsDetail...
2. Affiliate component không mount
3. **Zero tracking, zero trigger**

### Scenario 5: User quay lại sau vài ngày
1. localStorage vẫn giữ state từ lần trước
2. Nếu `trigger_count > 0`: Check dựa trên `last_triggered` (1 tiếng)
3. Nếu đủ thời gian → Trigger khi user click chapter navigation

## 🧪 Testing Instructions

### Development Testing

1. **Clear localStorage** (reset state):
   ```javascript
   localStorage.removeItem('affiliate_first_visit')
   localStorage.removeItem('affiliate_last_triggered')
   localStorage.removeItem('affiliate_trigger_count')
   ```

2. **Start dev server**:
   ```bash
   yarn dev
   ```

3. **Navigate to reading page**: `/truyen-tranh/{comic}/{chapter-slug}/{id}`

4. **Open browser console** - should see:
   ```
   [Affiliate] Tracking initialized for ComicsChapter page
   ```

5. **Click next/prev chapter immediately** → No affiliate (chưa đủ 15 phút)

6. **Wait 15 minutes** (or use quick test config: 1 minute)

7. **Click next/prev chapter** → Affiliate tab opens!
   ```
   [Affiliate] First trigger ready: {...}
   [Affiliate] Triggered successfully: {...}
   ```

### Quick Testing (1 minute delay)

Edit `.env`:
```env
VITE_AFFILIATE_FIRST_DELAY_MS=60000     # 1 phút
VITE_AFFILIATE_REPEAT_DELAY_MS=120000   # 2 phút
```

Restart server, wait 1 minute, click chapter navigation → Affiliate opens.

### Manual State Inspection

```javascript
// Check current state
localStorage.getItem('affiliate_first_visit')
localStorage.getItem('affiliate_last_triggered')
localStorage.getItem('affiliate_trigger_count')

// Calculate time remaining (manual)
const firstVisit = Number(localStorage.getItem('affiliate_first_visit'))
const now = Date.now()
const elapsed = now - firstVisit
const remaining = 900000 - elapsed // 900000 = 15 minutes
console.log('Minutes until first trigger:', Math.floor(remaining / 60000))
```

## 🛡️ Edge Cases Handled

### 1. User clicks rapidly
- Rate limit prevents multiple triggers
- Only trigger once per time window
- No spam

### 2. User switches chapters frequently
- Check happens on every navigation
- But trigger only when rate limit allows
- Smooth UX

### 3. localStorage disabled
- Try-catch wrap all operations
- Graceful fallback: skip affiliate
- App continues normally

### 4. Environment variables missing
- Default values provided
- System works with 15min/1hour defaults

### 5. Popup blockers
- Trigger synchronous with user click (bypasses most blockers)
- Silently fail if blocked
- State still updates (no retry spam)

### 6. Multiple tabs open
- Each tab has independent tracking initialization
- Share same localStorage state
- Consistent behavior across tabs

## 🔒 Security & Privacy

### Security
- `window.open()` với `noopener,noreferrer` flags
- URL hardcoded trong `.env`
- Triggered during user action (synchronous)
- No XSS risk

### Privacy
- **Zero tracking**: Không lưu user ID, IP, email
- **Local-only**: Data chỉ trong localStorage
- **Anonymous**: Works cho mọi user
- **No server calls**: Không send data về backend

## ⚡ Performance

### Resource Usage
- **Memory**: Minimal (no timers, just event handlers)
- **CPU**: <1ms per chapter navigation
- **Network**: 0 (no API calls)
- **Storage**: ~200 bytes localStorage

### Impact
- **Page load**: 0ms (component renders null)
- **Navigation**: <1ms overhead per click
- **Only active**: Khi user trong ComicsChapter page
- **No background work**: Không có timers chạy ngầm

## 📝 Code Reference

### Integration Points

1. **Initialization**: [src/pages/ComicsChapter.tsx:274](src/pages/ComicsChapter.tsx#L274)
   ```tsx
   <Affiliate />
   ```

2. **Trigger Logic**: [src/hooks/useChapterNavigation.ts:35](src/hooks/useChapterNavigation.ts#L35)
   ```typescript
   checkAndTriggerAffiliate()
   ```

### Core Files

- **[src/utils/affiliate.ts](src/utils/affiliate.ts)** - Rate limiting & trigger logic
- **[src/components/Affiliate.tsx](src/components/Affiliate.tsx)** - Initialization component
- **[src/hooks/useChapterNavigation.ts](src/hooks/useChapterNavigation.ts)** - Navigation integration

## 🐛 Troubleshooting

### Issue: Affiliate không trigger sau đúng thời gian

**Check**:
1. Đã click chuyển chapter chưa? (không tự động trigger)
2. Console có log không? `[Affiliate] Tracking initialized...`
3. localStorage có data? (inspect như hướng dẫn)
4. Environment variables đúng chưa?

**Debug**:
```javascript
// Check if should trigger
const firstVisit = Number(localStorage.getItem('affiliate_first_visit'))
const now = Date.now()
console.log('Elapsed:', (now - firstVisit) / 60000, 'minutes')
console.log('Required:', 15, 'minutes')
```

### Issue: Tab mở nhưng popup bị block

**Expected behavior**: Browser security feature.

**Why it should work**: Trigger happens synchronously with user click, should bypass most blockers.

**If still blocked**: Browser setting, nothing we can do.

### Issue: Trigger quá nhiều lần

**Check**: localStorage có đang update đúng không?

```javascript
localStorage.getItem('affiliate_trigger_count') // Should increment
localStorage.getItem('affiliate_last_triggered') // Should update
```

## ✅ Success Criteria

- ✅ Chỉ trigger khi user **click** chuyển chapter
- ✅ Không tự động trigger (no background timers)
- ✅ Lần đầu: Sau 15 phút từ first visit
- ✅ Lần sau: Sau 1 tiếng từ last trigger
- ✅ Configurable qua `.env`
- ✅ Persistent across sessions
- ✅ Synchronous with user action (bypass popup blockers)
- ✅ Zero background resource usage

## 🔄 Maintenance

### Thay đổi timing

Edit `.env`:
```env
VITE_AFFILIATE_FIRST_DELAY_MS=1800000  # 30 phút
VITE_AFFILIATE_REPEAT_DELAY_MS=7200000 # 2 tiếng
```

Restart dev server.

### Thay đổi URL

```env
VITE_AFFILIATE_URL=https://new-link.com
```

### Disable temporarily

Comment out trong ComicsChapter.tsx:
```tsx
{/* <Affiliate /> */}
```

Hoặc comment out trigger trong useChapterNavigation.ts:
```typescript
// checkAndTriggerAffiliate()
```

## 📊 Implementation Summary

| Aspect | Implementation |
|--------|----------------|
| Trigger Method | Event-driven (chapter navigation) |
| Timing | 15 min (first) / 1 hour (repeat) |
| Storage | localStorage (persistent) |
| Background Work | None (no timers) |
| Popup Blocker | Bypassed (synchronous with click) |
| Privacy | Zero tracking |
| Performance | <1ms overhead per navigation |
| Active Scope | ComicsChapter page only |
