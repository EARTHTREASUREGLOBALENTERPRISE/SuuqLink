import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ActivityItem, AddCartItemBody, AdminStats, Cart, Category, Conversation, ConversationDetail, CreateOrderBody, GetSearchSuggestionsParams, HealthStatus, ListProductsParams, ListVendorsParams, LoginBody, NotFoundResponse, Order, Product, ProductDetail, ProductListResponse, RegisterBody, SearchSuggestions, SendMessageBody, StartConversationBody, SwitchRoleBody, UpdateCartItemBody, User, Vendor, VendorAdminRow, VendorDetail } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current signed-in user
 */
export declare const getGetCurrentUserUrl: () => string;
export declare const getCurrentUser: (options?: RequestInit) => Promise<User>;
export declare const getGetCurrentUserQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetCurrentUserQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCurrentUserQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
export type GetCurrentUserQueryError = ErrorType<unknown>;
/**
 * @summary Get current signed-in user
 */
export declare function useGetCurrentUser<TData = Awaited<ReturnType<typeof getCurrentUser>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Sign in
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginBody: LoginBody, options?: RequestInit) => Promise<User>;
export declare const getLoginMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginBody>;
export type LoginMutationError = ErrorType<unknown>;
/**
 * @summary Sign in
 */
export declare const useLogin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginBody>;
}, TContext>;
/**
 * @summary Register new account
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerBody: RegisterBody, options?: RequestInit) => Promise<User>;
export declare const getRegisterMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterBody>;
export type RegisterMutationError = ErrorType<unknown>;
/**
 * @summary Register new account
 */
export declare const useRegister: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterBody>;
}, TContext>;
/**
 * @summary Switch active demo persona (buyer/seller/admin)
 */
export declare const getSwitchRoleUrl: () => string;
export declare const switchRole: (switchRoleBody: SwitchRoleBody, options?: RequestInit) => Promise<User>;
export declare const getSwitchRoleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof switchRole>>, TError, {
        data: BodyType<SwitchRoleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof switchRole>>, TError, {
    data: BodyType<SwitchRoleBody>;
}, TContext>;
export type SwitchRoleMutationResult = NonNullable<Awaited<ReturnType<typeof switchRole>>>;
export type SwitchRoleMutationBody = BodyType<SwitchRoleBody>;
export type SwitchRoleMutationError = ErrorType<unknown>;
/**
 * @summary Switch active demo persona (buyer/seller/admin)
 */
export declare const useSwitchRole: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof switchRole>>, TError, {
        data: BodyType<SwitchRoleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof switchRole>>, TError, {
    data: BodyType<SwitchRoleBody>;
}, TContext>;
/**
 * @summary List product categories
 */
export declare const getListCategoriesUrl: () => string;
export declare const listCategories: (options?: RequestInit) => Promise<Category[]>;
export declare const getListCategoriesQueryKey: () => readonly ["/api/categories"];
export declare const getListCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listCategories>>>;
export type ListCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary List product categories
 */
export declare function useListCategories<TData = Awaited<ReturnType<typeof listCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List vendor storefronts
 */
export declare const getListVendorsUrl: (params?: ListVendorsParams) => string;
export declare const listVendors: (params?: ListVendorsParams, options?: RequestInit) => Promise<Vendor[]>;
export declare const getListVendorsQueryKey: (params?: ListVendorsParams) => readonly ["/api/vendors", ...ListVendorsParams[]];
export declare const getListVendorsQueryOptions: <TData = Awaited<ReturnType<typeof listVendors>>, TError = ErrorType<unknown>>(params?: ListVendorsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVendors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listVendors>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListVendorsQueryResult = NonNullable<Awaited<ReturnType<typeof listVendors>>>;
export type ListVendorsQueryError = ErrorType<unknown>;
/**
 * @summary List vendor storefronts
 */
export declare function useListVendors<TData = Awaited<ReturnType<typeof listVendors>>, TError = ErrorType<unknown>>(params?: ListVendorsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVendors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get vendor details
 */
export declare const getGetVendorUrl: (id: number) => string;
export declare const getVendor: (id: number, options?: RequestInit) => Promise<VendorDetail>;
export declare const getGetVendorQueryKey: (id: number) => readonly [`/api/vendors/${number}`];
export declare const getGetVendorQueryOptions: <TData = Awaited<ReturnType<typeof getVendor>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVendor>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getVendor>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetVendorQueryResult = NonNullable<Awaited<ReturnType<typeof getVendor>>>;
export type GetVendorQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Get vendor details
 */
export declare function useGetVendor<TData = Awaited<ReturnType<typeof getVendor>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVendor>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List products for a vendor
 */
export declare const getGetVendorProductsUrl: (id: number) => string;
export declare const getVendorProducts: (id: number, options?: RequestInit) => Promise<Product[]>;
export declare const getGetVendorProductsQueryKey: (id: number) => readonly [`/api/vendors/${number}/products`];
export declare const getGetVendorProductsQueryOptions: <TData = Awaited<ReturnType<typeof getVendorProducts>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVendorProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getVendorProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetVendorProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getVendorProducts>>>;
export type GetVendorProductsQueryError = ErrorType<unknown>;
/**
 * @summary List products for a vendor
 */
export declare function useGetVendorProducts<TData = Awaited<ReturnType<typeof getVendorProducts>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getVendorProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List/search products with filters
 */
export declare const getListProductsUrl: (params?: ListProductsParams) => string;
export declare const listProducts: (params?: ListProductsParams, options?: RequestInit) => Promise<ProductListResponse>;
export declare const getListProductsQueryKey: (params?: ListProductsParams) => readonly ["/api/products", ...ListProductsParams[]];
export declare const getListProductsQueryOptions: <TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listProducts>>>;
export type ListProductsQueryError = ErrorType<unknown>;
/**
 * @summary List/search products with filters
 */
export declare function useListProducts<TData = Awaited<ReturnType<typeof listProducts>>, TError = ErrorType<unknown>>(params?: ListProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Featured products for the home feed
 */
export declare const getListFeaturedProductsUrl: () => string;
export declare const listFeaturedProducts: (options?: RequestInit) => Promise<Product[]>;
export declare const getListFeaturedProductsQueryKey: () => readonly ["/api/products/featured"];
export declare const getListFeaturedProductsQueryOptions: <TData = Awaited<ReturnType<typeof listFeaturedProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListFeaturedProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listFeaturedProducts>>>;
export type ListFeaturedProductsQueryError = ErrorType<unknown>;
/**
 * @summary Featured products for the home feed
 */
export declare function useListFeaturedProducts<TData = Awaited<ReturnType<typeof listFeaturedProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listFeaturedProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Trending products
 */
export declare const getListTrendingProductsUrl: () => string;
export declare const listTrendingProducts: (options?: RequestInit) => Promise<Product[]>;
export declare const getListTrendingProductsQueryKey: () => readonly ["/api/products/trending"];
export declare const getListTrendingProductsQueryOptions: <TData = Awaited<ReturnType<typeof listTrendingProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrendingProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTrendingProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTrendingProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listTrendingProducts>>>;
export type ListTrendingProductsQueryError = ErrorType<unknown>;
/**
 * @summary Trending products
 */
export declare function useListTrendingProducts<TData = Awaited<ReturnType<typeof listTrendingProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrendingProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get product details
 */
export declare const getGetProductUrl: (id: number) => string;
export declare const getProduct: (id: number, options?: RequestInit) => Promise<ProductDetail>;
export declare const getGetProductQueryKey: (id: number) => readonly [`/api/products/${number}`];
export declare const getGetProductQueryOptions: <TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetProductQueryResult = NonNullable<Awaited<ReturnType<typeof getProduct>>>;
export type GetProductQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Get product details
 */
export declare function useGetProduct<TData = Awaited<ReturnType<typeof getProduct>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get related products
 */
export declare const getGetRelatedProductsUrl: (id: number) => string;
export declare const getRelatedProducts: (id: number, options?: RequestInit) => Promise<Product[]>;
export declare const getGetRelatedProductsQueryKey: (id: number) => readonly [`/api/products/${number}/related`];
export declare const getGetRelatedProductsQueryOptions: <TData = Awaited<ReturnType<typeof getRelatedProducts>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRelatedProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRelatedProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRelatedProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getRelatedProducts>>>;
export type GetRelatedProductsQueryError = ErrorType<unknown>;
/**
 * @summary Get related products
 */
export declare function useGetRelatedProducts<TData = Awaited<ReturnType<typeof getRelatedProducts>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRelatedProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get search suggestions
 */
export declare const getGetSearchSuggestionsUrl: (params?: GetSearchSuggestionsParams) => string;
export declare const getSearchSuggestions: (params?: GetSearchSuggestionsParams, options?: RequestInit) => Promise<SearchSuggestions>;
export declare const getGetSearchSuggestionsQueryKey: (params?: GetSearchSuggestionsParams) => readonly ["/api/search/suggestions", ...GetSearchSuggestionsParams[]];
export declare const getGetSearchSuggestionsQueryOptions: <TData = Awaited<ReturnType<typeof getSearchSuggestions>>, TError = ErrorType<unknown>>(params?: GetSearchSuggestionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSearchSuggestions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSearchSuggestions>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSearchSuggestionsQueryResult = NonNullable<Awaited<ReturnType<typeof getSearchSuggestions>>>;
export type GetSearchSuggestionsQueryError = ErrorType<unknown>;
/**
 * @summary Get search suggestions
 */
export declare function useGetSearchSuggestions<TData = Awaited<ReturnType<typeof getSearchSuggestions>>, TError = ErrorType<unknown>>(params?: GetSearchSuggestionsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSearchSuggestions>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current cart
 */
export declare const getGetCartUrl: () => string;
export declare const getCart: (options?: RequestInit) => Promise<Cart>;
export declare const getGetCartQueryKey: () => readonly ["/api/cart"];
export declare const getGetCartQueryOptions: <TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCartQueryResult = NonNullable<Awaited<ReturnType<typeof getCart>>>;
export type GetCartQueryError = ErrorType<unknown>;
/**
 * @summary Get current cart
 */
export declare function useGetCart<TData = Awaited<ReturnType<typeof getCart>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add item to cart
 */
export declare const getAddCartItemUrl: () => string;
export declare const addCartItem: (addCartItemBody: AddCartItemBody, options?: RequestInit) => Promise<Cart>;
export declare const getAddCartItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addCartItem>>, TError, {
        data: BodyType<AddCartItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addCartItem>>, TError, {
    data: BodyType<AddCartItemBody>;
}, TContext>;
export type AddCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof addCartItem>>>;
export type AddCartItemMutationBody = BodyType<AddCartItemBody>;
export type AddCartItemMutationError = ErrorType<unknown>;
/**
 * @summary Add item to cart
 */
export declare const useAddCartItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addCartItem>>, TError, {
        data: BodyType<AddCartItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addCartItem>>, TError, {
    data: BodyType<AddCartItemBody>;
}, TContext>;
/**
 * @summary Update cart item quantity
 */
export declare const getUpdateCartItemUrl: (id: number) => string;
export declare const updateCartItem: (id: number, updateCartItemBody: UpdateCartItemBody, options?: RequestInit) => Promise<Cart>;
export declare const getUpdateCartItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError, {
        id: number;
        data: BodyType<UpdateCartItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError, {
    id: number;
    data: BodyType<UpdateCartItemBody>;
}, TContext>;
export type UpdateCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof updateCartItem>>>;
export type UpdateCartItemMutationBody = BodyType<UpdateCartItemBody>;
export type UpdateCartItemMutationError = ErrorType<unknown>;
/**
 * @summary Update cart item quantity
 */
export declare const useUpdateCartItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCartItem>>, TError, {
        id: number;
        data: BodyType<UpdateCartItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCartItem>>, TError, {
    id: number;
    data: BodyType<UpdateCartItemBody>;
}, TContext>;
/**
 * @summary Remove cart item
 */
export declare const getRemoveCartItemUrl: (id: number) => string;
export declare const removeCartItem: (id: number, options?: RequestInit) => Promise<Cart>;
export declare const getRemoveCartItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError, {
    id: number;
}, TContext>;
export type RemoveCartItemMutationResult = NonNullable<Awaited<ReturnType<typeof removeCartItem>>>;
export type RemoveCartItemMutationError = ErrorType<unknown>;
/**
 * @summary Remove cart item
 */
export declare const useRemoveCartItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeCartItem>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeCartItem>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Empty the cart
 */
export declare const getClearCartUrl: () => string;
export declare const clearCart: (options?: RequestInit) => Promise<Cart>;
export declare const getClearCartMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
export type ClearCartMutationResult = NonNullable<Awaited<ReturnType<typeof clearCart>>>;
export type ClearCartMutationError = ErrorType<unknown>;
/**
 * @summary Empty the cart
 */
export declare const useClearCart: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof clearCart>>, TError, void, TContext>;
/**
 * @summary List my orders
 */
export declare const getListOrdersUrl: () => string;
export declare const listOrders: (options?: RequestInit) => Promise<Order[]>;
export declare const getListOrdersQueryKey: () => readonly ["/api/orders"];
export declare const getListOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listOrders>>>;
export type ListOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List my orders
 */
export declare function useListOrders<TData = Awaited<ReturnType<typeof listOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Place an order (checkout)
 */
export declare const getCreateOrderUrl: () => string;
export declare const createOrder: (createOrderBody: CreateOrderBody, options?: RequestInit) => Promise<Order>;
export declare const getCreateOrderMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
export type CreateOrderMutationResult = NonNullable<Awaited<ReturnType<typeof createOrder>>>;
export type CreateOrderMutationBody = BodyType<CreateOrderBody>;
export type CreateOrderMutationError = ErrorType<unknown>;
/**
 * @summary Place an order (checkout)
 */
export declare const useCreateOrder: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createOrder>>, TError, {
        data: BodyType<CreateOrderBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createOrder>>, TError, {
    data: BodyType<CreateOrderBody>;
}, TContext>;
/**
 * @summary Get order details
 */
export declare const getGetOrderUrl: (id: number) => string;
export declare const getOrder: (id: number, options?: RequestInit) => Promise<Order>;
export declare const getGetOrderQueryKey: (id: number) => readonly [`/api/orders/${number}`];
export declare const getGetOrderQueryOptions: <TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getOrder>>>;
export type GetOrderQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Get order details
 */
export declare function useGetOrder<TData = Awaited<ReturnType<typeof getOrder>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List my conversations
 */
export declare const getListConversationsUrl: () => string;
export declare const listConversations: (options?: RequestInit) => Promise<Conversation[]>;
export declare const getListConversationsQueryKey: () => readonly ["/api/conversations"];
export declare const getListConversationsQueryOptions: <TData = Awaited<ReturnType<typeof listConversations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listConversations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListConversationsQueryResult = NonNullable<Awaited<ReturnType<typeof listConversations>>>;
export type ListConversationsQueryError = ErrorType<unknown>;
/**
 * @summary List my conversations
 */
export declare function useListConversations<TData = Awaited<ReturnType<typeof listConversations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Start or fetch a conversation with a vendor
 */
export declare const getStartConversationUrl: () => string;
export declare const startConversation: (startConversationBody: StartConversationBody, options?: RequestInit) => Promise<Conversation>;
export declare const getStartConversationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startConversation>>, TError, {
        data: BodyType<StartConversationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof startConversation>>, TError, {
    data: BodyType<StartConversationBody>;
}, TContext>;
export type StartConversationMutationResult = NonNullable<Awaited<ReturnType<typeof startConversation>>>;
export type StartConversationMutationBody = BodyType<StartConversationBody>;
export type StartConversationMutationError = ErrorType<unknown>;
/**
 * @summary Start or fetch a conversation with a vendor
 */
export declare const useStartConversation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startConversation>>, TError, {
        data: BodyType<StartConversationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof startConversation>>, TError, {
    data: BodyType<StartConversationBody>;
}, TContext>;
/**
 * @summary Get conversation with messages
 */
export declare const getGetConversationUrl: (id: number) => string;
export declare const getConversation: (id: number, options?: RequestInit) => Promise<ConversationDetail>;
export declare const getGetConversationQueryKey: (id: number) => readonly [`/api/conversations/${number}`];
export declare const getGetConversationQueryOptions: <TData = Awaited<ReturnType<typeof getConversation>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getConversation>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetConversationQueryResult = NonNullable<Awaited<ReturnType<typeof getConversation>>>;
export type GetConversationQueryError = ErrorType<NotFoundResponse>;
/**
 * @summary Get conversation with messages
 */
export declare function useGetConversation<TData = Awaited<ReturnType<typeof getConversation>>, TError = ErrorType<NotFoundResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getConversation>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Send a message
 */
export declare const getSendMessageUrl: (id: number) => string;
export declare const sendMessage: (id: number, sendMessageBody: SendMessageBody, options?: RequestInit) => Promise<ConversationDetail>;
export declare const getSendMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        id: number;
        data: BodyType<SendMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
    id: number;
    data: BodyType<SendMessageBody>;
}, TContext>;
export type SendMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendMessage>>>;
export type SendMessageMutationBody = BodyType<SendMessageBody>;
export type SendMessageMutationError = ErrorType<unknown>;
/**
 * @summary Send a message
 */
export declare const useSendMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMessage>>, TError, {
        id: number;
        data: BodyType<SendMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendMessage>>, TError, {
    id: number;
    data: BodyType<SendMessageBody>;
}, TContext>;
/**
 * @summary Marketplace overview metrics
 */
export declare const getGetAdminStatsUrl: () => string;
export declare const getAdminStats: (options?: RequestInit) => Promise<AdminStats>;
export declare const getGetAdminStatsQueryKey: () => readonly ["/api/admin/stats"];
export declare const getGetAdminStatsQueryOptions: <TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminStats>>>;
export type GetAdminStatsQueryError = ErrorType<unknown>;
/**
 * @summary Marketplace overview metrics
 */
export declare function useGetAdminStats<TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary All orders (admin)
 */
export declare const getListAdminOrdersUrl: () => string;
export declare const listAdminOrders: (options?: RequestInit) => Promise<Order[]>;
export declare const getListAdminOrdersQueryKey: () => readonly ["/api/admin/orders"];
export declare const getListAdminOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listAdminOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminOrders>>>;
export type ListAdminOrdersQueryError = ErrorType<unknown>;
/**
 * @summary All orders (admin)
 */
export declare function useListAdminOrders<TData = Awaited<ReturnType<typeof listAdminOrders>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary All vendors (admin)
 */
export declare const getListAdminVendorsUrl: () => string;
export declare const listAdminVendors: (options?: RequestInit) => Promise<VendorAdminRow[]>;
export declare const getListAdminVendorsQueryKey: () => readonly ["/api/admin/vendors"];
export declare const getListAdminVendorsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminVendors>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminVendors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminVendors>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminVendorsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminVendors>>>;
export type ListAdminVendorsQueryError = ErrorType<unknown>;
/**
 * @summary All vendors (admin)
 */
export declare function useListAdminVendors<TData = Awaited<ReturnType<typeof listAdminVendors>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminVendors>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary All users (admin)
 */
export declare const getListAdminUsersUrl: () => string;
export declare const listAdminUsers: (options?: RequestInit) => Promise<User[]>;
export declare const getListAdminUsersQueryKey: () => readonly ["/api/admin/users"];
export declare const getListAdminUsersQueryOptions: <TData = Awaited<ReturnType<typeof listAdminUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminUsers>>>;
export type ListAdminUsersQueryError = ErrorType<unknown>;
/**
 * @summary All users (admin)
 */
export declare function useListAdminUsers<TData = Awaited<ReturnType<typeof listAdminUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Recent marketplace activity feed
 */
export declare const getGetAdminRecentActivityUrl: () => string;
export declare const getAdminRecentActivity: (options?: RequestInit) => Promise<ActivityItem[]>;
export declare const getGetAdminRecentActivityQueryKey: () => readonly ["/api/admin/recent-activity"];
export declare const getGetAdminRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getAdminRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminRecentActivity>>>;
export type GetAdminRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Recent marketplace activity feed
 */
export declare function useGetAdminRecentActivity<TData = Awaited<ReturnType<typeof getAdminRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map