import { auth, signOut } from "@/auth";
export default async function Home() {
	const session = await auth();
	return (
		<>
			<h1>Profile</h1>
			{JSON.stringify(session)}
			<form
				action={async () => {
					"use server";
					await signOut();
				}}
			>
				<button type="submit">Sign Out</button>
			</form>
		</>
	);
}
