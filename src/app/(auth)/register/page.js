import AuthContainer from "@/components/Auth/AuthContainer";
import RegistrationForm from "@/components/Forms/RegistrationForm";

export const metadata = {
	title: "TeamForFilm | Registration",
	description: "Generated by create next app",
};

export default function Register() {
	return (
		<>
			<AuthContainer
				heading="Registration"
				subHeading="Enter your info below to register to TeamForFilm"
				footerHeading="Already have an account?"
				footerLinkText="Login"
				footerLink="/login"
			>
				<RegistrationForm />
			</AuthContainer>
		</>
	);
}
