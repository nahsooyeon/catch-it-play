import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/utils/tailwind";
import { Slot } from "@radix-ui/react-slot";

const ButtonVariants = cva(
	"", {
	variants: {
		theme: {
			alphabet: "flex-grow-0 w-[90%] h-[80%] shadow-[0px_7px_0px_0px_rgba(0,0,0,0.25)] rounded-[20px] border border-gray-300 flex items-center justify-center font-bold text-2xl lg:text-4xl",
			primary: "bg-gray-500 text-white",
		}
	},
	defaultVariants: {
		theme: "alphabet",
	},
}
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
	asChild?: boolean;
	suffix?: React.ReactNode;
	loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			prefix,
			suffix,
			loading = false,
			theme,
			asChild = false,
			className,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (loading) {
				e.preventDefault();
				e.stopPropagation();
			} else {
				props.onClick?.(e);
			}
		};

		return (
			<Comp
				ref={ref}
				data-testid="button"
				className={cn(ButtonVariants({ theme }), className)}
				{...props}
				onClick={handleClick}>
				<div className="relative inline-flex flex-1 items-center justify-between gap-[6px] pt-[1.5px]">
					{prefix && (
						<div data-testid="button-prefix" className="flex h-[16px] w-[16px] items-center justify-center">
							{prefix}
						</div>
					)}
					<div
						className={cn(
							"inline-flex flex-1 items-center !justify-center",
						)}>
						{children}
					</div>
					{suffix && (
						<div data-testid="button-suffix" className="flex h-[16px] w-[16px] items-center justify-center">
							{suffix}
						</div>
					)}
				</div>
			</Comp>
		);
	}
);

Button.displayName = "Button";

export default Button;