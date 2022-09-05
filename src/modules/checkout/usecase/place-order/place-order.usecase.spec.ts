import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { InputPlaceOrderDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("Place Order Use Case unit tests", () => {

        // buscar o cliente. caso não encontre -> client not found;

        // validar produtos; 
        // recuperar os produtos;

        // criar o objeto do client;
        // criar o objeto do order (client, products);

        // process payment -> paymentfacade.process (orderid, amount); 

        // caso pagamento aprovado -> gerar invoice;
        // mudar status da minha order para approved;

        // retornar dto
    
    describe("validateProducts method", () => {
    
        // @ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error if no products are selected", async () => {

            const input: InputPlaceOrderDto = {
                clientId: "0",
                products: []
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                    .rejects
                    .toThrow(new Error("No products selected."));

        });

        it("should throw an error when product is out of stock", async () => {
            
            const mockProductFacade = {
                checkStock: jest.fn(({productId}: {productId: string}) => 
                    Promise.resolve({    
                        productId,
                        stock: productId === "1" ? 0 : 1
                    })
                )
            };

            //@ts-expect-error - force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: InputPlaceOrderDto = {
                clientId: "0",
                products: [{ productId: "1" }]
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                    .rejects
                    .toThrow(new Error("Product 1 is not available in stock"));


            input = {
                clientId: "0",
                products: [{productId: "0"}, {productId: "1"}]
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                    .rejects
                    .toThrow(new Error("Product 1 is not available in stock"));
            
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "0",
                products: [{productId: "0"}, {productId: "1"}, {productId: "2"}]
            };

            await expect(placeOrderUseCase["validateProducts"](input))
                    .rejects
                    .toThrow(new Error("Product 1 is not available in stock"))

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);

        });

    });

    describe("getProduct method", () => {

        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        // @ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should thrown an error when product not found", () => {

            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            };

            // @ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            expect(placeOrderUseCase["getProduct"]("0"))
                    .rejects
                    .toThrow(new Error("Product not found"));

        });

        it("should return a product", async () => {

            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0
                })
            };

            // @ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description: "Product 0 description",
                    salesPrice: 0  
                })
            );

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });

    });

    describe("execute method", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(mockDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error when client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            }

            // @ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            // @ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: InputPlaceOrderDto = {
                clientId: "0",
                products: []
            };

            await expect(placeOrderUseCase.execute(input))
                    .rejects
                    .toThrow(new Error("Client not found."));
        });

        it("should throw an error when products are not valid ", async () => {

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true)
            }

            // @ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest
                    // @ts-expect-error - spy on private method
                    .spyOn(placeOrderUseCase, "validateProducts")
                    // @ts-expect-error - not return never
                    .mockRejectedValue(new Error("No products selected."));

            // @ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: InputPlaceOrderDto = {
                clientId: "1",
                products: []
            };

            await expect(placeOrderUseCase.execute(input))
                    .rejects
                    .toThrow(new Error("No products selected."));

            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });

        describe("Place an order", () => {

            it("should not be approved", async () => {
                const clientProps = {
                    id: "1c",
                    name: "Client 0",
                    document: "0000",
                    email: "client@user.com",
                    street: "some address",
                    number: "1",
                    complement: "",
                    city: "some city",
                    state: "some state",
                    zipCode: "000"
                };
    
                const mockClientFacade = {
                    add: jest.fn(),
                    find: jest.fn().mockResolvedValue(clientProps)
                };
    
                const mockPaymentFacade = {
                    process: jest.fn()
                };
    
                const mockCheckoutRepo = {
                    findOrder: jest.fn(),
                    addOrder: jest.fn()
                };
    
                const mockInvoiceFacade = {
                    find: jest.fn(),
                    create: jest.fn().mockResolvedValue({id: "1i"})
                };
    
                const placeOrderUseCase = new PlaceOrderUseCase(
                    mockClientFacade,
                    null,
                    null,
                    mockCheckoutRepo,
                    mockInvoiceFacade,
                    mockPaymentFacade
                );
    
                const products = {
                    "1": new Product({
                        id: new Id("1"),
                        name: "Product 1",
                        description: "Some Product 1",
                        salesPrice: 40
                    }),
                    "2": new Product({
                        id: new Id("2"),
                        name: "Product 2",
                        description: "Some Product 2",
                        salesPrice: 30
                    })
                };
    
                const mockValidateProducts = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                // @ts-expect-error - 
                .mockResolvedValue(null);
    
                const mockGetProduct = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                // @ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId];
                });
                
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                const input: InputPlaceOrderDto = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}]
                }

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBeNull();
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    {productId: "1"}, {productId: "2"}
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});

                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);

                expect(mockGetProduct).toHaveBeenCalledTimes(2);

                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
                
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                });
                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(0);
            });

            it("should be approved", async () => {
                const clientProps = {
                    id: "1c",
                    name: "Client 0",
                    document: "0000",
                    email: "client@user.com",
                    street: "some address",
                    number: "1",
                    complement: "",
                    city: "some city",
                    state: "some state",
                    zipCode: "000"
                };
    
                const mockClientFacade = {
                    add: jest.fn(),
                    find: jest.fn().mockResolvedValue(clientProps)
                };
    
                const mockPaymentFacade = {
                    process: jest.fn()
                };
    
                const mockCheckoutRepo = {
                    findOrder: jest.fn(),
                    addOrder: jest.fn()
                };
    
                const mockInvoiceFacade = {
                    find: jest.fn(),
                    create: jest.fn().mockResolvedValue({id: "1i"})
                };
    
                const placeOrderUseCase = new PlaceOrderUseCase(
                    mockClientFacade,
                    null,
                    null,
                    mockCheckoutRepo,
                    mockInvoiceFacade,
                    mockPaymentFacade
                );
    
                const products = {
                    "1": new Product({
                        id: new Id("1"),
                        name: "Product 1",
                        description: "Some Product 1",
                        salesPrice: 40
                    }),
                    "2": new Product({
                        id: new Id("2"),
                        name: "Product 2",
                        description: "Some Product 2",
                        salesPrice: 30
                    })
                };
    
                const mockValidateProducts = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                // @ts-expect-error - 
                .mockResolvedValue(null);
    
                const mockGetProduct = jest
                // @ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                // @ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId];
                });

                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 100,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date()
                });

                const input: InputPlaceOrderDto = {
                    clientId: "1c",
                    products: [{productId: "1"}, {productId: "2"}]
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe("1i");
                expect(output.total).toBe(70);
                expect(output.products).toStrictEqual([
                    {productId: "1"},
                    {productId: "2"}
                ]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({id: "1c"});

                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);

                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenLastCalledWith({
                    orderId: output.id,
                    amount: output.total
                });

                expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1);
                expect(mockInvoiceFacade.create).toHaveBeenCalledWith({
                    name: clientProps.name,
                    document: clientProps.document,
                    street: clientProps.street,
                    number: clientProps.number,
                    complement: clientProps.complement,
                    city: clientProps.city,
                    state: clientProps.state,
                    zipCode: clientProps.zipCode,
                    items: [
                        {
                            id: products["1"].id.id,
                            name: products["1"].name,
                            price: products["1"].salesPrice    
                        },
                        {
                            id: products["2"].id.id,
                            name: products["2"].name,
                            price: products["2"].salesPrice
                        }
                    ]
                });

                expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
            });
        });

    });

});