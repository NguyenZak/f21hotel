// Tạo tài khoản Chủ (quản trị cao nhất). Website không cho tự đăng ký, nên tài khoản đầu tiên tạo bằng script này.
// Đặt trong .env.local: ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD (ít nhất 12 ký tự), rồi chạy:
//   npm run create-admin          # CMS ở máy
//   npm run create-admin:remote   # CMS thật trên Cloudflare (D1)
// Xong thì xoá ADMIN_PASSWORD khỏi .env.local. Script không in mật khẩu ra màn hình.
import { getPayload } from "payload";
import config from "@payload-config";

const { ADMIN_EMAIL: email, ADMIN_NAME: name = "Chủ khách sạn", ADMIN_PASSWORD: password } = process.env;

if (!email || !password) {
  console.error("Thiếu ADMIN_EMAIL hoặc ADMIN_PASSWORD trong .env.local");
  process.exit(1);
}
if (password.length < 12) {
  console.error("ADMIN_PASSWORD cần ít nhất 12 ký tự");
  process.exit(1);
}

const payload = await getPayload({ config });
const found = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, overrideAccess: true });
if (found.docs[0]) {
  payload.logger.warn(`Đã có tài khoản ${email}, không tạo lại. Đổi mật khẩu trong CMS › Tài khoản.`);
} else {
  await payload.create({
    collection: "users",
    data: { email, name, password, role: "owner", active: true },
    overrideAccess: true,
  });
  payload.logger.info(`Đã tạo tài khoản Chủ: ${email}`);
}
process.exit(0);
