import UserMenu from "@/app/dashboard/components/UserMenu";
import GridListSwitchButton from "../app/dashboard/components/GridListSwitchButton";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 py-3  border-gray-700 bg-[#171717]">
      {/* <h2 className="text-lg font-semibold text-white">
        <UserMenu />
      </h2> */}

      {/* Giữa: Nút Grid/List/Search */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <GridListSwitchButton />
      </div>

      {/* Phải: chừa trống (để cân đối flex) */}
      <div className="w-[120px]" />
    </div>
  );
}
