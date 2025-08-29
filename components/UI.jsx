"use client";
import React from "react";

export const Button = ({ className="", ...props }) => (
  <button {...props} className={`inline-flex items-center justify-center rounded-2xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-50 ${className}`} />
);

export const OutlineButton = ({ className="", ...props }) => (
  <button {...props} className={`inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 ${className}`} />
);

export const Badge = ({ children, color="bg-gray-100 text-gray-700" }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>{children}</span>
);

export const TextInput = (props) => (
  <input {...props} className={`block w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${props.className||""}`} />
);

export const TextArea = (props) => (
  <textarea rows={6} {...props} className={`block w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black ${props.className||""}`} />
);
