// Logo F21 cho trang quản trị: Logo ở màn hình đăng nhập, Icon ở góc trên thanh điều hướng
/* eslint-disable @next/next/no-img-element -- ảnh tĩnh nhỏ trong giao diện Payload */

export function Logo() {
  return <img src="/img/logo-ngang.png" alt="F21 Hotel" width={240} height={79} style={{ display: "block", height: "auto" }} />;
}

export function Icon() {
  return <img src="/img/bieu-tuong.png" alt="F21 Hotel" width={28} height={27} style={{ display: "block" }} />;
}
