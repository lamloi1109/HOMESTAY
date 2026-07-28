"use client";

import { Icon } from "@/components/gaoji/Icon";

export const THEME_KEY = "gh-theme";

/**
 * Đổi giữa hai mood của design system: "retreat" sáng và "urgent" tối.
 * Chỉ đổi thuộc tính `data-theme` trên <html> — toàn bộ token tự đổi theo.
 *
 * Cố ý KHÔNG giữ theme trong state React. Nguồn sự thật là thuộc tính trên
 * <html>, do script chặn render trong layout đặt trước khi vẽ. Nếu đồng bộ lại
 * vào state thì phải đọc DOM trong useEffect — vừa gây cascading render, vừa
 * làm server và client render lệch nhau. Thay vào đó vẽ sẵn cả hai icon rồi để
 * CSS ẩn cái không dùng: không state, không nhấp nháy, không lệch hydrate.
 */
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Trình duyệt chặn localStorage (chế độ riêng tư) — vẫn đổi được trong phiên.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Đổi giao diện sáng tối"
      style={{
        width: 40,
        height: 40,
        borderRadius: "var(--radius-circle)",
        border: "1px solid var(--border-default)",
        background: "var(--surface-raised)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all var(--dur-base) var(--ease-standard)",
      }}
    >
      <span className="gh-when-light" aria-hidden>
        <Icon name="moon" size={17} />
      </span>
      <span className="gh-when-dark" aria-hidden>
        <Icon name="sun" size={17} />
      </span>
    </button>
  );
}
