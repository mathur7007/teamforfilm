"use client";

import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobApplicationFromSchema } from "@/schemas/Schemas";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { filmDepartments } from "@/config/data";
import { useRouter } from "next/navigation";
import { savJobApplication, updateJobApplication } from "@/app/actions/jobApplications";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function JobApplicationFrom({ teamMemberId, companyId, jobPostId, jobApplicationId, jobType, defaultValues }) {
	const router = useRouter();
	const [resumeProgress, setResumeProgress] = useState(0);
	const [reelProgress, setReelProgress] = useState(0);

	const formHook = useForm({
		resolver: zodResolver(JobApplicationFromSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		control,
		formState: { isSubmitting },
	} = formHook;

	const handleResumeChange = (event, onChange) => {
		const file = event.target.files[0];
		if (file) {
			onChange(file);
		}
	};

	const handleReelChange = (event, onChange) => {
		const file = event.target.files[0];
		if (file) {
			onChange(file);
		}
	};

	const uploadFile = (file, path, setProgress) => {
		const storage = getStorage();
		const storageRef = ref(storage, path);
		const uploadTask = uploadBytesResumable(storageRef, file);

		return new Promise((resolve, reject) => {
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setProgress(progress);
				},
				(error) => reject(error),
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						resolve(downloadURL);
					});
				}
			);
		});
	};

	async function onSubmit(formData) {
		try {
			let resumeUrl = formData.resume;
			let auditionReelUrl = formData.auditionReel;

			if (formData.resume instanceof File) {
				resumeUrl = await uploadFile(formData.resume, `/job_applications/resume/${formData.resume.name}`, setResumeProgress);
			}

			if (formData.auditionReel instanceof File) {
				auditionReelUrl = await uploadFile(formData.auditionReel, `/job_applications/auditionReel/${formData.auditionReel.name}`, setReelProgress);
			}

			let response;
			if (jobApplicationId) {
				response = await updateJobApplication(jobApplicationId, {
					...formData,
					resume: resumeUrl,
					auditionReel: auditionReelUrl,
				});
			} else {
				response = await savJobApplication(teamMemberId, companyId, jobPostId, {
					...formData,
					resume: resumeUrl,
					auditionReel: auditionReelUrl,
				});
			}

			if (response.success) {
				toast.success(response.message);
				router.push("/account/profile/my-applications");
			} else {
				console.log(response.message);
				toast.error("something went wrong!");
			}
		} catch (error) {
			console.log("error", error.message);
			toast.error("something went wrong!");
		}
	}

	return (
		<Form {...formHook}>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
						name="phoneNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone Number</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Phone Number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="Email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={control}
					name="coverLetter"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cover Letter</FormLabel>
							<FormControl>
								<Textarea placeholder="Cover Letter" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
						name="projectType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Applying As</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Applying As" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{jobType === "Casting Call" ? (
												<SelectItem value="actor">Actor</SelectItem>
											) : (
												filmDepartments?.map(({ value, label }) => (
													<SelectItem key={value} value={value}>
														{label}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="expectedSalary"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Expected Salary</FormLabel>
								<FormControl>
									<Input type="text" placeholder="Expected Salary" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
						name="resume"
						render={({ field: { onChange, value, ...rest } }) => (
							<FormItem>
								<FormLabel>Resume</FormLabel>
								<FormControl>
									<Input type="file" accept="application/pdf" onChange={(event) => handleResumeChange(event, onChange)} {...rest} />
								</FormControl>
								<FormMessage />
								{resumeProgress > 0 && <Progress value={resumeProgress} />}
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name="auditionReel"
						render={({ field: { onChange, value, ...rest } }) => (
							<FormItem>
								<FormLabel>Upload Your Audition Reel</FormLabel>
								<FormControl>
									<Input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(event) => handleReelChange(event, onChange)} {...rest} />
								</FormControl>
								<FormMessage />
								{reelProgress > 0 && <Progress value={reelProgress} />}
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Submit"}
				</Button>
			</form>
		</Form>
	);
}
