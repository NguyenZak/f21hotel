import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";
import kvNextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache";

// Nội dung do CMS quản lý: trang dựng sẵn lưu ở Cloudflare KV, khi lưu trong CMS thì
// revalidateTag đánh dấu cũ (cũng ghi ở KV) và trang được dựng lại ở lần truy cập sau.
// Cả hai binding NEXT_INC_CACHE_KV và NEXT_TAG_CACHE_KV trỏ về cùng một KV namespace.
export default defineCloudflareConfig({
	incrementalCache: kvIncrementalCache,
	tagCache: kvNextTagCache,
	// Dựng lại trang ở nền bằng cách gọi chính worker (cần binding WORKER_SELF_REFERENCE)
	queue: memoryQueue,
	enableCacheInterception: true,
});
