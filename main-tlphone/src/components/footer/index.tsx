"use client"
import Link from "next/link";

export default function Footer() {
    return (
        <div className="hidden md:block">
            <footer className="footer bg-base-200 text-base-content p-10 min-h-fit bg-white justify-center items-center">
                <div className="flex gap-20">
                    <nav className="flex flex-col gap-2" style={{ height: "max-content" }}>
                        <h6 className="font-bold">Về chúng tôi</h6>
                        <Link href={""} className="hover:text-red">Giới thiệu về công ty</Link>
                        <Link href={""} className="hover:text-red">Liên hệ hợp tác kinh doanh (B2B)</Link>
                        <Link href={""} className="hover:text-red">Hướng dẫn mua hàng Online</Link>
                        <Link href={""} className="hover:text-red">Hướng dẫn mua hàng trả góp</Link>
                    </nav>
                    <nav className="flex flex-col gap-2" style={{ height: "max-content" }}>
                        <h6 className="font-bold">Chính sách</h6>
                        <Link href={""} className="hover:text-red">Chính sách bảo hành</Link>
                        <Link href={""} className="hover:text-red">Chính sách bán hàng</Link>
                        <Link href={""} className="hover:text-red">Chính sách bảo mật</Link>
                        <Link href={""} className="hover:text-red">Chính sách kiểm hàng</Link>
                    </nav>
                    <nav className="flex flex-col gap-2" style={{ height: "max-content" }}>
                        <h6 className="font-bold">Tổng đài hỗ trợ (Miễn phí)</h6>
                        <Link href={""} className="hover:text-red">Mua ngay: <span className="color ms-9">1800.6018</span></Link>
                        <Link href={""} className="hover:text-red">Bảo hành tại <br /> Viện Di Động: <span className="color ms-3">1800.6729</span></Link>
                        <Link href={""} className="hover:text-red">Góp ý: <span className="color ms-17">1800.6306</span></Link>
                    </nav>
                    <form className="gap-2" style={{ height: "max-content" }}>
                        <h6 className="font-bold">Kết nối với Di Động Việt</h6>
                        <div className="flex gap-5 mt-3">
                            <Link href={"https://www.facebook.com/AzenKain"} className="hover:text-red"><img src="https://didongviet.vn/images/footer/fb.svg" alt="" className="w-7" /></Link>
                            <Link href={"https://www.youtube.com/user/didongvietnam"} className="hover:text-red"><img src="https://didongviet.vn/images/footer/yt.svg" alt="" className="w-7" /></Link>
                            <Link href={"https://www.tiktok.com/@nacute_.06"} className="hover:text-red"><img src="https://didongviet.vn/images/footer/tik.svg" alt="" className="w-7" /></Link>
                        </div>
                    </form>
                </div>
            </footer>
        </div>
    );
}