"use client";
import { useState } from "react";
import { ChevronDown, Trash } from "lucide-react";
import { useTag } from "@/app/dashboard/context/TagContext";

// export default function TagSelector() {
export default function TagSelector({
  onChange,
}: {
  onChange?: (tagIds: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);

  const { tags, createTag, deleteTag } = useTag();

  const toggleSelect = (item: { id: string; name: string }) => {
    const isSelected = selected.some((s) => s.id === item.id);
    const updated = isSelected
      ? selected.filter((s) => s.id !== item.id)
      : [...selected, item];
    setSelected(updated);
    onChange?.(updated.map((t) => t.id));
  };
  // 👉 Thêm tag mới
  const addTag = async () => {
    if (!search.trim()) return;
    const newTag = await createTag(search.trim());
    if (newTag) {
      const updated = [...selected, newTag];
      setSelected(updated);
      onChange?.(updated.map((t) => t.id)); // 🟢 Giờ newTag.id sẽ có giá trị
      setSearch("");
      setOpen(false);
    }
  };

  // 👉 Xóa tag hoàn toàn khỏi hệ thống
  const handleDeleteTag = async (id: string, name: string) => {
    if (!confirm(`Xóa tag "${name}" khỏi hệ thống?`)) return;
    await deleteTag(id);
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="relative">
      <label className="block text-gray-400 mb-1">Tags</label>

      {/* Selected tags */}
      <div
        className="flex flex-wrap gap-2 items-center px-3 py-2 bg-[#121212] border border-[#333] rounded-md cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected.length > 0 ? (
          selected.map((item) => (
            <span
              key={item.id}
              className="flex items-center gap-1 bg-[#2a2a2a] px-2 py-1 rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              #{item.name}
              {/* ❌ unselect */}
              <button
                onClick={() =>
                  setSelected(selected.filter((s) => s.id !== item.id))
                }
                className="text-gray-400 hover:text-red-400"
              >
                ✕
              </button>
            </span>
          ))
        ) : (
          <span className="text-gray-500">Select tags...</span>
        )}
        <ChevronDown
          className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-[#1c1c1c] border border-[#333] rounded-lg shadow-xl animate-fadeIn">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search or create..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-[#121212] border-b border-[#333] focus:outline-none text-gray-100"
          />

          {/* Tag list */}
          <div className="max-h-[180px] overflow-y-auto">
            {tags
              .filter((t) =>
                t.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((t) => (
                <div
                  key={t.id}
                  className={`flex justify-between items-center px-3 py-2 hover:bg-[#2a2a2a] rounded-md transition ${
                    selected.some((s) => s.id === t.id)
                      ? "bg-blue-600/30 text-blue-300"
                      : "text-gray-200"
                  }`}
                >
                  {/* click vào tên → chọn/bỏ chọn */}
                  <span
                    className="cursor-pointer select-none"
                    onClick={() => toggleSelect(t)}
                  >
                    #{t.name}
                  </span>

                  {/* 🗑️ delete thật */}
                  <button
                    onClick={() => handleDeleteTag(t.id, t.name)}
                    className="text-gray-500 hover:text-red-500 transition"
                    title="Xóa khỏi hệ thống"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}

            {/* Nếu không tìm thấy → gợi ý tạo mới */}
            {!tags.some((t) =>
              t.name.toLowerCase().includes(search.toLowerCase())
            ) &&
              search.trim() && (
                <div
                  onClick={addTag}
                  className="px-3 py-2 text-blue-400 cursor-pointer hover:bg-[#2a2a2a]"
                >
                  ➕ Create new “{search}”
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
