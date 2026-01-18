// src/App.tsx
import { Navigate, Route, Routes } from "react-router-dom";
import Shell from "./components/Shell";

import Landing from "./pages/Landing";
import Calculate from "./pages/Calculate";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/verifyEmail";

import PayePit from "./pages/tax/PayePit";
import Vat from "./pages/tax/Vat";
import Freelancer from "./pages/tax/FreeLancer";
import Company from "./pages/tax/Company";
import TaxGuides from "./pages/TaxGuides";
import About from "./pages/About";
import History from "./pages/History";
import Privacy_Policy from "./pages/Privacy_Policy";
import Terms_Conditions from "./pages/Terms_Conditions";

export default function App() {
	return (
		<Shell>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/calculate" element={<Calculate />} />
				<Route path="/history" element={<History />} />
				<Route path="/taxguide" element={<TaxGuides />} />
				<Route path="/about" element={<About />} />
				<Route path="/Privacy_Policy" element={<Privacy_Policy />} />
				<Route path="/Terms_Conditions" element={<Terms_Conditions />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/verify-email" element={<VerifyEmail />} />
				{/* Public tax pages */}
				<Route path="/tax/paye-pit" element={<PayePit />} />
				<Route path="/tax/vat" element={<Vat />} />
				<Route path="/tax/freelancer" element={<Freelancer />} />
				<Route path="/tax/company" element={<Company />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Shell>
	);
}
