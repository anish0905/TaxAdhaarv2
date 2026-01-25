export default function WhatsAppTopBar() {
  return (
    <div className="fixed top-0 left-0 w-full z-[100] bg-green-600 text-white py-2 px-4 text-center text-sm flex items-center justify-center gap-2 shadow-md">
      <span className="flex items-center gap-1">
        Need help? WhatsApp: <b>+91 7557721426</b>
      </span>
      <a 
        href="https://wa.me/917557721426" 
        target="_blank" 
        className="ml-2 bg-white text-green-600 px-3 py-0.5 rounded-full text-xs font-bold hover:bg-gray-100 transition"
      >
        Chat
      </a>
    </div>
  );
}