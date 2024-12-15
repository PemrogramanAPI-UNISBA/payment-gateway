export type PaginationType = {
	totalPage: number;
	currentPage: number;
	pagesItems: number;
	nextPage: number;
	prevPage: number;
} | null;

export type ResponseMeta = {
	statusCode: number;
	message: string;
	pagination: PaginationType;
};

export type ResponseData<T> = {
	data?: T;
};

export type ApiResponse<T> = {
	meta: ResponseMeta;
	data?: T;
};

export type ErrorResponse<T> = {
	errors: {
		statusCode: number;
		message: string;
		detail: T | null;
	};
};
