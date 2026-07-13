export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">
          Login to DivyaArpan
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-6"
        />

        <button className="w-full bg-orange-600 text-white py-3 rounded-lg">
          Login
        </button>
      </div>
    </main>
  );
}