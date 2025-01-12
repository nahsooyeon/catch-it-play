"use client";

import { Fragment, ReactElement, ReactNode, cloneElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { v4 as uuidv4 } from "uuid";
import { create, useStore } from "zustand";

interface ModalOpenOptions {
	close?: boolean;
}

interface ModalStoreProps {
	list: Map<string, ReactNode>;
	openModal: (node: ReactNode, options?: ModalOpenOptions) => void;
	closeModal: (id?: string) => void;
}

export const modalStore = create<ModalStoreProps>((set, get) => ({
	list: new Map(),
	openModal: (node, options) => {
		const id = uuidv4();
		const { list } = get();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const modal = cloneElement(node as any, { id, ...options });
		list.set(id, modal);
		set({ list });
	},
	closeModal: id => {
		if (id) {
			const { list } = get();
			if (!list.has(id)) throw new Error("id not found");

			list.delete(id);
			set({ list });
		} else {
			throw new Error("id is required");
		}
	},
}));

const ModalWrapper = () => {
	const { list, closeModal } = useStore(modalStore);
	const modals = Array.from(list.entries());
	return (
		<div>
			{modals.map(([key, modal], index) => {
				const dom = modal as ReactElement<ModalOpenOptions>;
				const { close = true } = dom.props;

				const handleClickToCloseDimmerArea = (key?: string) => {
					if (close) closeModal(key);
				};

				return (
					<div key={key}
						style={{
							position: "fixed",
							width: "100%",
							height: "100%",
							zIndex: 100 + index

						}}
						className={`fixed inset-0 flex items-center justify-center`}>
						<div style={{
							background: "rgba(0, 0, 0, 0.5)",
						}} className="absolute inset-0 z-0 w-full h-full" onClick={() => handleClickToCloseDimmerArea(key)} />
						<div className="relative z-10">{modal}</div>
					</div>
				);
			})}
		</div>
	);
};

export const ModalProvider = () => {
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (typeof window === "undefined") return <Fragment />;

	if (!mounted) return null;

	return createPortal(<ModalWrapper />, document.getElementById("modal-root") as HTMLElement);
};
