// "use client";
// import { useState } from "react";
// import { ChevronDown, Trash } from "lucide-react";
// import { useCategory } from "@/app/dashboard/context/CategoryContext";

// export default function CategorySelector({
//   onChange,
// }: {
//   onChange?: (categoryIds: string[]) => void;
// }) {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);
//   const { categories, createCategory, deleteCategory } = useCategory();

//   const toggleSelect = (item: { id: string; name: string }) => {
//     const isSelected = selected.some((s) => s.id === item.id);
//     const updated = isSelected
//       ? selected.filter((s) => s.id !== item.id)
//       : [...selected, item];
//     setSelected(updated);
//     onChange?.(updated.map((c) => c.id));
//   };

//   const addCategory = async () => {
//     if (!search.trim()) return;
//     const newCat = await createCategory(search.trim());
//     if (newCat) {
//       const updated = [...selected, newCat];
//       setSelected(updated);
//       setSearch("");
//       setOpen(false);
//       onChange?.(updated.map((c) => c.id));
//     }
//   };

//   const handleDeleteCategory = async (id: string, name: string) => {
//     if (!confirm(`Xóa "${name}" khỏi hệ thống?`)) return;
//     await deleteCategory(id);
//     const updated = selected.filter((s) => s.id !== id);
//     setSelected(updated);
//     onChange?.(updated.map((c) => c.id));
//   };

//   return (
//     <div className="relative">
//       <label className="block text-gray-400 mb-1">Categories</label>
//       <div
//         className="flex flex-wrap gap-2 items-center px-3 py-2 bg-[#121212] border border-[#333] rounded-md cursor-pointer"
//         onClick={() => setOpen(!open)}
//       >
//         {selected.length ? (
//           selected.map((item) => (
//             <span
//               key={item.id}
//               className="flex items-center gap-1 bg-[#2a2a2a] px-2 py-1 rounded-md"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {item.name}
//               <button
//                 onClick={() => {
//                   const updated = selected.filter((s) => s.id !== item.id);
//                   setSelected(updated);
//                   onChange?.(updated.map((c) => c.id));
//                 }}
//                 className="text-gray-400 hover:text-red-400"
//               >
//                 ✕
//               </button>
//             </span>
//           ))
//         ) : (
//           <span className="text-gray-500">Select categories...</span>
//         )}
//         <ChevronDown
//           className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}
//           size={18}
//         />
//       </div>

//       {open && (
//         <div className="absolute z-50 w-full mt-2 bg-[#1c1c1c] border border-[#333] rounded-lg shadow-xl">
//           <input
//             type="text"
//             placeholder="Search or create..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full px-3 py-2 bg-[#121212] border-b border-[#333] text-gray-100 focus:outline-none"
//           />
//           <div className="max-h-[180px] overflow-y-auto">
//             {categories
//               .filter((c) =>
//                 c.name.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((c) => (
//                 <div
//                   key={c.id}
//                   className={`flex justify-between items-center px-3 py-2 hover:bg-[#2a2a2a] rounded-md ${
//                     selected.some((s) => s.id === c.id)
//                       ? "bg-blue-600/30 text-blue-300"
//                       : "text-gray-200"
//                   }`}
//                 >
//                   <span
//                     className="cursor-pointer select-none"
//                     onClick={() => toggleSelect(c)}
//                   >
//                     {c.name}
//                   </span>
//                   <button
//                     onClick={() => handleDeleteCategory(c.id, c.name)}
//                     className="text-gray-500 hover:text-red-500"
//                   >
//                     <Trash size={15} />
//                   </button>
//                 </div>
//               ))}
//             {!categories.some((c) =>
//               c.name.toLowerCase().includes(search.toLowerCase())
//             ) &&
//               search.trim() && (
//                 <div
//                   onClick={addCategory}
//                   className="px-3 py-2 text-blue-400 cursor-pointer hover:bg-[#2a2a2a]"
//                 >
//                   ➕ Create new “{search}”
//                 </div>
//               )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { ChevronDown, Trash } from "lucide-react";
import { useCategory } from "@/app/dashboard/context/CategoryContext";

export default function CategorySelector({
  onChange,
}: {
  onChange?: (categoryId: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(
    null
  );
  const { categories, createCategory, deleteCategory } = useCategory();

  // ✅ Chỉ chọn 1 category duy nhất
  const handleSelect = (item: { id: string; name: string }) => {
    if (selected?.id === item.id) {
      // nếu click lại thì bỏ chọn
      setSelected(null);
      onChange?.(null);
    } else {
      setSelected(item);
      onChange?.(item.id);
      setOpen(false); // đóng dropdown sau khi chọn
    }
  };

  const addCategory = async () => {
    if (!search.trim()) return;
    const newCat = await createCategory(search.trim());
    if (newCat) {
      setSelected(newCat);
      onChange?.(newCat.id);
      setSearch("");
      setOpen(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Xóa "${name}" khỏi hệ thống?`)) return;
    await deleteCategory(id);
    if (selected?.id === id) {
      setSelected(null);
      onChange?.(null);
    }
  };

  return (
    <div className="relative">
      <label className="block text-gray-400 mb-1">Category</label>
      <div
        className="flex items-center justify-between px-3 py-2 bg-[#121212] border border-[#333] rounded-md cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <span className="flex items-center gap-1">
            {selected.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelected(null);
                onChange?.(null);
              }}
              className="ml-2 text-gray-400 hover:text-red-400"
            >
              ✕
            </button>
          </span>
        ) : (
          <span className="text-gray-500">Select a category...</span>
        )}
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={18}
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-[#1c1c1c] border border-[#333] rounded-lg shadow-xl">
          <input
            type="text"
            placeholder="Search or create..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 bg-[#121212] border-b border-[#333] text-gray-100 focus:outline-none"
          />
          <div className="max-h-[180px] overflow-y-auto">
            {categories
              .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((c) => (
                <div
                  key={c.id}
                  className={`flex justify-between items-center px-3 py-2 hover:bg-[#2a2a2a] rounded-md ${
                    selected?.id === c.id
                      ? "bg-blue-600/30 text-blue-300"
                      : "text-gray-200"
                  }`}
                >
                  <span
                    className="cursor-pointer select-none"
                    onClick={() => handleSelect(c)}
                  >
                    {c.name}
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(c.id, c.name)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}
            {!categories.some((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            ) &&
              search.trim() && (
                <div
                  onClick={addCategory}
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
