import { NextResponse } from 'next/server';
import { ResponseMeta, ApiResponse, PaginationType, ErrorResponse } from './../types/api-response';

export class ApiResponseBuilder {
	static success<T>(data: T, meta?: Partial<ResponseMeta>): NextResponse<ApiResponse<T>> {
		return NextResponse.json(
			{
				meta: {
					statusCode: 200,
					message: 'Success',
					pagination: null,
					...meta,
				},
				data,
			},
			{
				status: meta?.statusCode || 200,
			}
		);
	}

	static created<T>(data: T, meta?: Partial<ResponseMeta>): NextResponse<ApiResponse<T>> {
		return NextResponse.json(
			{
				meta: {
					statusCode: 201,
					message: 'Resource created successfully',
					pagination: null,
					...meta,
				},
				data,
			},
			{ status: 201 }
		);
	}

	static error<T>(message: string, statusCode: number = 500, details?: T): NextResponse<ErrorResponse<T>> {
		return NextResponse.json(
			{
				errors: {
					statusCode,
					message,
					detail: details ?? null,
				},
			},
			{ status: statusCode } // ✅ Set the HTTP status
		);
	}

	static paginated<T>(data: T[], pagination: PaginationType): NextResponse<ApiResponse<T[]>> {
		return NextResponse.json({
			meta: {
				statusCode: 200,
				message: 'Success',
				pagination,
			},
			data,
		});
	}
}
