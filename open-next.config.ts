import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Site chủ yếu là trang tĩnh, nội dung đổi bằng cách deploy lại,
// nên đọc trang dựng sẵn từ static assets là đủ, không cần R2.
export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
	enableCacheInterception: true,
});
