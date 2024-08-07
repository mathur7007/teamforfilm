import * as z from "zod";

export const LoginSchema = z.object({
	email: z
		.string({
			message: "Please provide your email",
		})
		.email({
			message: "Please provide a valid email",
		}),
	password: z.string({
		message: "Please provide your password",
	}),
});

export const registrationSchema = z.object({
	firstName: z.string({
		message: "Please provide Last Name",
	}),
	lastName: z.string({
		message: "Please provide your First Name",
	}),
	email: z
		.string({
			message: "Please provide your email",
		})
		.email({
			message: "Please provide a valid email",
		}),
	password: z
		.string({
			message: "Please provide your password",
		})
		.min(6, "Password must be at least 6 characters"),
});

export const ForgotPasswordSchema = z.object({
	email: z
		.string({
			message: "Please enter your email",
		})
		.email({
			message: "Please enter a valid email",
		}),
});

export const ChooseRoleSchema = z.object({
	role: z.enum(["TeamMember", "Company"], {
		required_error: "You need to select your Role",
	}),
});

export const profileFormSchema = z.object({
	profileImage: z.any(),
	firstName: z.string().min(2, {
		message: "firstName must be at least 2 characters.",
	}),
	lastName: z.string().min(2, {
		message: "lastName must be at least 2 characters.",
	}),
	email: z
		.string({
			required_error: "Please enter your email.",
		})
		.email({ message: "Email must be valid" }),
	alternateEmail: z.string().email({ message: "Email must be valid" }).optional(),
	phone: z.string().optional(),
	alternatePhone: z.string().optional(),
	// dob: z
	// 	.preprocess(
	// 		(arg) => {
	// 			// Convert input value to a Date object
	// 			if (typeof arg === "string" || arg instanceof Date) {
	// 				return new Date(arg);
	// 			}
	// 		},
	// 		z.date({
	// 			required_error: "A date of birth is required.",
	// 		})
	// 	)
	// 	.optional(),
	dob: z.string().optional(),
	bio: z.string().max(200).min(4),
	gender: z.enum(["Male", "Female"], {
		required_error: "You need to select your gender",
	}),
});

export const carrierSummarySchema = z.object({
	featureFilms: z.string(),
	shortFilms: z.string(),
	musicVideos: z.string(),
	documentaries: z.string(),
	commercials: z.string(),
	theatreDrama: z.string(),
	webSeries: z.string(),
});

export const TeamMemberBasicInfoFormSchema = z.object({
	profileImage: z.any(),
	firstName: z.any(),
	lastName: z.any(),
	filmDepartments: z.any(),
	height: z.any(),
	ethnicity: z.any(),
	ageGroup: z.any(),
	nationality: z.any(),
	location: z.any(),
	languageSkills: z.any(),
	additionalSkills: z.any(),
	about: z.any(),
});

export const TeamMemberTrainingFormSchema = z.object({
	courseTaken: z.any(),
	instituition: z.any(),
	mentor: z.any(),
	courseLength: z.any(),
});

export const TeamMemberFilmographyFormSchema = z.object({
	projectName: z.any(),
	projectType: z.any(),
	role: z.any(),
	productionYear: z.any(),
	projectLink: z.any(),
});

export const CompanyProfileFormSchema = z.object({
	profileImage: z.any(),
	companyName: z.any(),
	category: z.any(),
	noOfEmployees: z.any(),
	website: z.any(),
	email: z.any(),
	location: z.any(),
	aboutCompany: z.any(),
});

export const JobPostFormSchema = z.object({
	jobType: z.enum(["Casting Call", "Call for TeamMembers"], {
		message: "Job Type is required",
	}),
	projectTitle: z.string().min(1, "Project Title is required"),
	projectType: z.string().min(1, "Project Type is required"),
	projectDetails: z.string().max(500),
	companyName: z.any(),
	auditionType: z.any(),
	auditionLocation: z.any(),
	auditionDate: z.any(),
	auditionTime: z.any(),
	contactPerson: z.any(),
	contactNumber: z.any(),
	projectPoster: z.any(),
	projectDocument: z.any(),
	actorRequirements: z.array(
		z.object({
			characterName: z.any(),
			gender: z.any(),
			age: z.any(),
			requiredNumbers: z.any(),
			eligibility: z.any(),
			salaryRange: z.any(),
		})
	),
	teamMemberRequirements: z.array(
		z.object({
			teamMember: z.any(),
			eligibility: z.any(),
			requiredNumbers: z.any(),
			salary: z.any(),
		})
	),
	applicationDeadline: z.any(),
	projectDuration: z.any(),
});

export const JobApplicationFromSchema = z.object({
	phoneNumber: z.string({
		message: "Please provide Phone Number",
	}),
	email: z
		.string({
			message: "Please enter your email",
		})
		.email({
			message: "Please enter a valid email",
		}),
	coverLetter: z.string({
		message: "Write a cover letter",
	}),
	expectedSalary: z.any(),
	projectType: z.string({
		message: "Please select applying as",
	}),
	resume: z.any(),
	auditionReel: z.instanceof(File),
});

export const audioReelsFormSchema = z.object({
	soundTrackTitle: z.string().min(4, {
		message: "firstName must be at least 2 characters.",
	}),
	soundTrack: z.any(),
	description: z.string().min(10, {
		message: "firstName must be at least 10 characters.",
	}),
});

export const showReelsFormSchema = z.object({
	projectTitle: z.string().min(4, {
		message: "firstName must be at least 2 characters.",
	}),
	projectDescription: z.string().min(10, {
		message: "firstName must be at least 10 characters.",
	}),
	projectLink: z.string(),
	showReelTimeStamps: z.array(
		z.object({
			title: z.any(),
			hours: z.any(),
			minutes: z.any(),
			seconds: z.any(),
		})
	),
});

export const gallerySchema = z.object({
	galleryImages: z.array(z.instanceof(File)).min(1, "At least add 1 new file to upload"),
});

export const reviewFormSchema = z.object({
	rating: z.number().min(1, "Please rate atleast 1 review"),
	comments: z.any(),
});
