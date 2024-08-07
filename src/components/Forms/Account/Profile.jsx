"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { format } from "date-fns";

import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema } from "@/schemas/Schemas";
import { updateUserProfile } from "@/app/actions/users_profile";
import { genders } from "@/config/data";
import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

export function ProfileForm({ uid, defaultValues }) {
	const [preview, setPreview] = useState(defaultValues?.profileImage || "/profile_pictures/placeholder.jpg");
	const formHook = useForm({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = formHook;

	async function onSubmit(formData) {
		try {
			let profileImageUrl = formData.profileImage;

			if (formData.profileImage instanceof File) {
				const storage = getStorage();
				const storageRef = ref(storage, `/users_profile/profile_pictures/${uid}-${formData.profileImage.name}`);
				const snapshot = await uploadBytes(storageRef, formData.profileImage);
				profileImageUrl = await getDownloadURL(snapshot.ref);
			}

			const response = await updateUserProfile(uid, {
				...formData,
				profileImage: profileImageUrl,
			});

			if (response.success === true) {
				toast.success("Profile saved successfully");
			} else {
				console.log(response.message);
				toast.error("Something went wrong");
			}
		} catch (error) {
			console.log(error.message);
			toast.error("Profile saved successfully");
		}
	}

	const handleImageChange = (event, onChange) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
			onChange(file);
		}
	};

	return (
		<Form {...formHook}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="grid grid-rows-1 md:grid-cols-4 gap-5">
					<div className="flex justify-center">
						<FormField
							control={control}
							name="profileImage"
							render={({ field: { onChange, value, ...rest } }) => (
								<>
									<FormItem>
										<FormLabel>
											<div className="relative overflow-hidden rounded-full w-[150px] h-[150px] bg-gray-200 flex items-center justify-center">
												<Image
													src={preview}
													alt="Profile Image"
													height="150"
													width="150"
													className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
												/>
											</div>
										</FormLabel>
										<FormControl>
											<Input type="file" accept="image/*" className="hidden" {...rest} onChange={(event) => handleImageChange(event, onChange)} />
										</FormControl>
										<FormMessage />
									</FormItem>
								</>
							)}
						/>
					</div>
					<div className="md:col-span-3 space-y-5">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="First Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder="Last Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="example@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="alternateEmail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Alternate Email</FormLabel>
										<FormControl>
											<Input placeholder="example@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input placeholder="phone" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="alternatePhone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Alternate Phone</FormLabel>
										<FormControl>
											<Input placeholder="Alternate Phone" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={control}
								name="dob"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date of birth</FormLabel>
										<FormControl>
											<Input type="date" placeholder="Pick a date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Gender</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select your gender" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{genders?.map(({ value, label }) => (
													<SelectItem key={value} value={value}>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button className="w-full" type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Updating profile..." : "Update profile"}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
