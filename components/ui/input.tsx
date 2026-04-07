"use client";

import * as React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Brand = "thor" | "vision" | "audition";

// ── Helpers ───────────────────────────────────────────────────────────────────

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const brandFocus: Record<Brand, string> = {
  thor:     "focus:border-thor-accent   focus:ring-thor-accent/20",
  vision:   "focus:border-vision-accent focus:ring-vision-accent/20",
  audition: "focus:border-audition-accent focus:ring-audition-accent/20",
};

// ── Input ─────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string;
  error?:       string;
  hint?:        string;
  brand?:       Brand;
  iconLeft?:    React.ReactNode;
  iconRight?:   React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      brand = "vision",
      iconLeft,
      iconRight,
      disabled,
      id,
      wrapperClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? React.useId();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-thor-text"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-thor-muted">
              <span className="w-4 h-4">{iconLeft}</span>
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full rounded-[var(--radius-soft)]",
              "bg-thor-surface border border-thor-border",
              "px-3.5 py-2.5 text-sm text-thor-text",
              "placeholder:text-thor-muted",
              "transition-all duration-200",
              "outline-none ring-2 ring-transparent",
              brandFocus[brand],
              "focus:shadow-[var(--shadow-soft)]",
              iconLeft  ? "pl-9" : undefined,
              iconRight ? "pr-9" : undefined,
              error     ? "border-danger ring-danger/20" : undefined,
              disabled  ? "opacity-50 cursor-not-allowed bg-thor-surface-2" : undefined,
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {iconRight && (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-thor-muted">
              <span className="w-4 h-4">{iconRight}</span>
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-thor-muted">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// ── Select ────────────────────────────────────────────────────────────────────

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:  string;
  error?:  string;
  hint?:   string;
  brand?:  Brand;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      brand = "vision",
      disabled,
      id,
      wrapperClassName,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? React.useId();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-thor-text">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-[var(--radius-soft)]",
              "bg-thor-surface border border-thor-border",
              "px-3.5 py-2.5 pr-9 text-sm text-thor-text",
              "transition-all duration-200",
              "outline-none ring-2 ring-transparent",
              brandFocus[brand],
              error    && "border-danger ring-danger/20",
              disabled && "opacity-50 cursor-not-allowed bg-thor-surface-2",
              className,
            )}
            aria-invalid={!!error}
            {...props}
          >
            {children}
          </select>

          {/* Chevron */}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-thor-muted">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-thor-muted">{hint}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

// ── Textarea ──────────────────────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?:  string;
  error?:  string;
  hint?:   string;
  brand?:  Brand;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      brand = "vision",
      disabled,
      id,
      wrapperClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const textareaId = id ?? React.useId();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-thor-text">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          className={cn(
            "w-full rounded-[var(--radius-soft)]",
            "bg-thor-surface border border-thor-border",
            "px-3.5 py-2.5 text-sm text-thor-text",
            "placeholder:text-thor-muted",
            "transition-all duration-200 resize-y min-h-[120px]",
            "outline-none ring-2 ring-transparent",
            brandFocus[brand],
            error    && "border-danger ring-danger/20",
            disabled && "opacity-50 cursor-not-allowed bg-thor-surface-2",
            className,
          )}
          aria-invalid={!!error}
          {...props}
        />

        {error && <p className="text-xs text-danger">{error}</p>}
        {!error && hint && <p className="text-xs text-thor-muted">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
