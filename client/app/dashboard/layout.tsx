import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { ViewProvider } from "@/app/dashboard/context/ViewContext";
import HabitFooter from "./components/HabitFooter";
import AuthGuard from "@/components/auth/AuthGuard"; // 👈 Thêm dòng này
import { CategoryProvider } from "./context/CategoryContext";
import { TagProvider } from "./context/TagContext";
import { HabitProvider } from "./context/HabitContext";
import { HabitGridProvider } from "./context/HabitGridContext";
import { HabitListProvider } from "./context/HabitListContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AuthGuard>
    //   {/* 👆 Bọc toàn bộ layout trong AuthGuard */}
    //   <ViewProvider>
    //     <HabitGridProvider>
    //       <HabitListProvider>
    //         <HabitProvider>
    //           <CategoryProvider>
    //             <TagProvider>
    //               <div className="h-screen w-screen flex flex-col bg-base-200 text-base-content ">
    //                 {/* 🧭 TopBar: cố định trên cùng */}
    //                 <header className="h-14 flex items-center justify-between px-4 border-base-300 bg-base-100 fixed top-0 left-0 right-0 z-30">
    //                   <TopBar />
    //                 </header>

    //                 {/* 🧭 Dưới TopBar là toàn bộ nội dung (Sidebar + Main) */}
    //                 <div className="flex flex-1 min-h-0 pt-14">
    //                   {/* Sidebar */}
    //                   <aside className="hidden md:flex flex-col w-64 h-full border-base-300 bg-base-300/10">
    //                     <Sidebar />
    //                   </aside>

    //                   {/* Main content */}
    //                   <main className="flex flex-col flex-1 h-full border border-base-300 rounded-md bg-base-100 overflow-hidden">
    //                     {children}
    //                     <HabitFooter />
    //                   </main>
    //                 </div>
    //               </div>
    //             </TagProvider>
    //           </CategoryProvider>
    //         </HabitProvider>
    //       </HabitListProvider>
    //     </HabitGridProvider>
    //   </ViewProvider>
    // </AuthGuard>
    <AuthGuard>
      <ViewProvider>
        <HabitGridProvider>
          <HabitProvider>
            <CategoryProvider>
              <TagProvider>
                <HabitListProvider>
                  {" "}
                  {/* moved xuống đây */}
                  <div className="h-screen w-screen flex flex-col bg-base-200 text-base-content ">
                    <header className="h-14 flex items-center justify-between px-4 border-base-300 bg-base-100 fixed top-0 left-0 right-0 z-30">
                      <TopBar />
                    </header>

                    <div className="flex flex-1 min-h-0 pt-14">
                      <aside className="hidden md:flex flex-col w-64 h-full border-base-300 bg-base-300/10">
                        <Sidebar />
                      </aside>

                      <main className="flex flex-col flex-1 h-full border border-base-300 rounded-md bg-base-100 overflow-hidden">
                        {children}
                        <HabitFooter />
                      </main>
                    </div>
                  </div>
                </HabitListProvider>
              </TagProvider>
            </CategoryProvider>
          </HabitProvider>
        </HabitGridProvider>
      </ViewProvider>
    </AuthGuard>
  );
}
