export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary">Habit Tracker</h2>
          <p>Chào mừng bạn trở lại 👋</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Đăng nhập</button>
          </div>
        </div>
      </div>
    </div>
  );
}
