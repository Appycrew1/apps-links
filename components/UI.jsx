"use client";
import React from "react";

export function Button({ children, className="", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
export function OutlineButton({ children, className="", ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
export function Badge({ children, color="bg-gray-100 text-gray-800", className="" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color} ${className}`}>{children}</span>
  );
}
export function TextInput({ className="", ...props }) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none ${className}`}
    />
  );
}
export function TextArea({ className="", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none min-h-[120px] ${className}`}
    />
  );
}
