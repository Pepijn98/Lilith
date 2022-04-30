/* eslint-disable @typescript-eslint/no-unused-vars */
import "axios";

declare module "axios" {
    interface Meta {
        requestStartedAt?: number;
    }

    interface AxiosRequestConfig<T> {
        meta: Meta;
    }

    interface AxiosResponse<T, D> {
        responseTime?: number;
    }
}
