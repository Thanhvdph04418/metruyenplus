# Nginx Rules - Phần Cần Thêm Vào Config Hiện Tại

## Vị Trí Thêm Code

Thêm các rules này vào trong block `server { ... }` của nginx config hiện tại, **trước** block `location / { ... }`

## Code Cần Thêm

```nginx
# ==========================================
# URL Normalization Rules - SEO Fix
# ==========================================

# 1. Remove trailing slash (301 redirect)
rewrite ^/(.*)/$ /$1 permanent;

# 2. Remove double slashes in URL
if ($request_uri ~ "^[^?]*?//") {
    rewrite "^" $scheme://$host$uri permanent;
}

# 3. Fix /truyen-tranh/:slug//0 pattern
rewrite ^/truyen-tranh/(.*?)//0$ /truyen-tranh/$1 permanent;

# 4. Remove excluded query parameters (tracking params)
if ($args ~* "(.*)(?:^|&)(utm_source|utm_medium|utm_campaign|utm_content|utm_term|fbclid|gclid|ref|source|campaign|medium)=[^&]*&?(.*)") {
    set $clean_args $1$3;
    rewrite ^(.*)$ $1? permanent;
}
```

## Ví Dụ Config Đầy Đủ

```nginx
server {
    listen 80;
    server_name tcomicclub.com www.tcomicclub.com;

    root /var/www/tcomic;
    index index.html;

    # ==========================================
    # THÊM PHẦN NÀY VÀO ĐÂY
    # ==========================================

    # Remove trailing slash
    rewrite ^/(.*)/$ /$1 permanent;

    # Remove double slashes
    if ($request_uri ~ "^[^?]*?//") {
        rewrite "^" $scheme://$host$uri permanent;
    }

    # Fix /truyen-tranh/:slug//0 pattern
    rewrite ^/truyen-tranh/(.*?)//0$ /truyen-tranh/$1 permanent;

    # Remove tracking parameters
    if ($args ~* "(.*)(?:^|&)(utm_source|utm_medium|utm_campaign|utm_content|utm_term|fbclid|gclid|ref|source|campaign|medium)=[^&]*&?(.*)") {
        set $clean_args $1$3;
        rewrite ^(.*)$ $1? permanent;
    }

    # ==========================================
    # KẾT THÚC PHẦN THÊM
    # ==========================================

    # SPA routing (phần này có sẵn rồi)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static files caching (có thể có sẵn)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Test Sau Khi Thêm

```bash
# 1. Test config syntax
sudo nginx -t

# 2. Reload nginx
sudo systemctl reload nginx

# 3. Test redirects
curl -I https://tcomicclub.com/the-loai/?page=1     # → 301 redirect to /the-loai
curl -I https://tcomicclub.com/the-loai//           # → 301 redirect to /the-loai
curl -I https://tcomicclub.com/truyen-tranh/abc//0  # → 301 redirect to /truyen-tranh/abc
```

## Giải Thích

- **Line 1**: Xóa trailing slash (`/the-loai/` → `/the-loai`)
- **Line 2-4**: Xóa double slashes (`//`) trong URL
- **Line 3**: Fix pattern `/truyen-tranh/:slug//0` thành `/truyen-tranh/:slug`
- **Line 4**: Xóa tracking parameters (`?utm_source=...`, `?fbclid=...`)

## Lưu Ý

- Tất cả redirects dùng `permanent` (301) để báo Google đây là redirect vĩnh viễn
- Rules này chạy **trước** khi request đến `location /` block
- Không ảnh hưởng đến các config hiện tại của bạn
