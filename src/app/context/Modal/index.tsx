"use client";

import { cloneElement, createContext, Fragment, ReactElement, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";

export interface ModalOpenOptions {
	close?: boolean;
}

interface ModalContextProps {
	list: Map<string, ReactElement>;
	openModal: (node: ReactElement, options?: ModalOpenOptions) => void;
	closeModal: (id?: string) => void;
}

export const ModalContext = createContext<ModalContextProps>({
	list: new Map(),
	openModal: () => { },
	closeModal: () => { },
});

export const ModalContextProvider = ({ children }: {
	children: React.ReactNode;
}) => {
	const [list, setList] = useState(new Map());

	const openModal = (node: ReactElement, options?: ModalOpenOptions) => {
		const id = uuidv4();
		const modal = cloneElement(node, { id, ...options } as Partial<ReactElement<unknown>> & { id: string; });
		list.set(id, modal);
		setList(new Map(list));
	};

	const closeModal = (id?: string) => {
		if (id) {
			if (!list.has(id)) throw new Error("id not found");

			list.delete(id);
			setList(new Map(list));
		} else {
			throw new Error("id is required");
		}
	};

	return (
		<ModalContext.Provider value={{ list, openModal, closeModal }}>
			{children}
		</ModalContext.Provider>
	);
};

const ModalContainer = () => {
	const { list, closeModal } = useContext(ModalContext);
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
					<div key={key} className={`fixed inset-0 flex items-center justify-center z-[${index}]`}>
						<div className="absolute inset-0 z-0 bg-black opacity-20" onClick={() => handleClickToCloseDimmerArea(key)} />
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

	return createPortal(<ModalContainer />, document.getElementById("modal-root") as HTMLElement);
};
