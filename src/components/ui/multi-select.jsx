import * as React from "react";
import { cva } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";

const multiSelectVariants = cva("m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300", {
	variants: {
		variant: {
			default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
			secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
			destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
			inverted: "inverted",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export const MultiSelect = React.forwardRef(
	(
		{
			options,
			value = [], // Ensure default value is an empty array
			onValueChange,
			variant,
			placeholder = "Select options",
			maxCount = 2,
			className,
			...props
		},
		ref
	) => {
		const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

		const handleInputKeyDown = (event) => {
			if (event.key === "Enter") {
				setIsPopoverOpen(true);
			} else if (event.key === "Backspace" && !event.currentTarget.value) {
				const newSelectedValues = [...value];
				newSelectedValues.pop();
				onValueChange(newSelectedValues);
			}
		};

		const toggleOption = (optionValue) => {
			const newSelectedValues = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue];
			onValueChange(newSelectedValues);
		};

		const handleClear = () => {
			onValueChange([]);
		};

		const handleTogglePopover = () => {
			setIsPopoverOpen((prev) => !prev);
		};

		const clearExtraOptions = () => {
			onValueChange(value.slice(0, maxCount));
		};

		const toggleAll = () => {
			if (value.length === options.length) {
				handleClear();
			} else {
				const allValues = options.map((option) => option.value);
				onValueChange(allValues);
			}
		};

		return (
			<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
				<PopoverTrigger asChild>
					<Button
						ref={ref}
						{...props}
						onClick={handleTogglePopover}
						className={cn("flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit", className)}
					>
						{value.length > 0 ? (
							<div className="flex justify-between items-center w-full">
								<div className="flex flex-wrap items-center">
									{value.slice(0, maxCount).map((val) => {
										const option = options.find((o) => o.value === val);
										const IconComponent = option?.icon;
										return (
											<Badge key={val} className={cn(multiSelectVariants({ variant, className }))}>
												{IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
												{option?.label}
												<XCircle
													className="ml-2 h-4 w-4 cursor-pointer"
													onClick={(event) => {
														event.stopPropagation();
														toggleOption(val);
													}}
												/>
											</Badge>
										);
									})}
									{value.length > maxCount && (
										<Badge
											className={cn(
												"bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
												multiSelectVariants({ variant, className })
											)}
										>
											{`+ ${value.length - maxCount} more`}
											<XCircle
												className="ml-2 h-4 w-4 cursor-pointer"
												onClick={(event) => {
													event.stopPropagation();
													clearExtraOptions();
												}}
											/>
										</Badge>
									)}
								</div>
								<div className="flex items-center justify-between">
									<XIcon
										className="h-4 mx-2 cursor-pointer text-muted-foreground"
										onClick={(event) => {
											event.stopPropagation();
											handleClear();
										}}
									/>
									<Separator orientation="vertical" className="flex min-h-6 h-full" />
									<ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between w-full mx-auto">
								<span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
								<ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
							</div>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start" onEscapeKeyDown={() => setIsPopoverOpen(false)}>
					<Command>
						<CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								<CommandItem key="all" onSelect={toggleAll} style={{ pointerEvents: "auto", opacity: 1 }} className="cursor-pointer">
									<div
										className={cn(
											"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
											value.length === options.length ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
										)}
									>
										<CheckIcon className="h-4 w-4" />
									</div>
									<span>(Select All)</span>
								</CommandItem>
								{options.map((option) => {
									const isSelected = value.includes(option.value);
									return (
										<CommandItem
											key={option.value}
											onSelect={() => toggleOption(option.value)}
											style={{ pointerEvents: "auto", opacity: 1 }}
											className="cursor-pointer"
										>
											<div
												className={cn(
													"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
													isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"
												)}
											>
												<CheckIcon className="h-4 w-4" />
											</div>
											{option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
											<span>{option.label}</span>
										</CommandItem>
									);
								})}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<div className="flex items-center justify-between">
									{value.length > 0 && (
										<>
											<CommandItem
												onSelect={handleClear}
												style={{ pointerEvents: "auto", opacity: 1 }}
												className="flex-1 justify-center cursor-pointer"
											>
												Clear
											</CommandItem>
											<Separator orientation="vertical" className="flex min-h-6 h-full" />
										</>
									)}
									<CommandSeparator />
									<CommandItem
										onSelect={() => setIsPopoverOpen(false)}
										style={{ pointerEvents: "auto", opacity: 1 }}
										className="flex-1 justify-center cursor-pointer"
									>
										Close
									</CommandItem>
								</div>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	}
);

MultiSelect.displayName = "MultiSelect";
