import AddProductUseCase from "../../product-adm/usecase/add-product/add-product.usecase";
import Address from "./address";

describe("Address unit tests", () => {

    const expectedStreet = "Rua Abc";
    const expectedNumber = "99";
    const expectedCity = "Caxias do Sul";
    const expectedState = "Rio Grande do Sul";
    const expectedZipCode = "90333000";

    it("should throw an error when street is empty", () => {
        expect(() => {
            const address = new Address(
                "",
                expectedNumber,
                expectedCity,
                expectedState,
                expectedZipCode,
                )
        }).toThrowError("Street is required");
    });

    it("should throw an error when number is empty", () => {
        expect(() => {
            const address = new Address(
                expectedStreet,
                "",
                expectedCity,
                expectedState,
                expectedZipCode,
                )
        }).toThrowError("Number is required");
    });

    it("should throw an error when city is empty", () => {
        expect(() => {
            const address = new Address(
                expectedStreet,
                expectedNumber,
                "",
                expectedState,
                expectedZipCode,
                )
        }).toThrowError("City is required");
    });

    it("should throw an error when state is empty", () => {
        expect(() => {
            const address = new Address(
                expectedStreet,
                expectedNumber,
                expectedCity,
                "",
                expectedZipCode,
                )
        }).toThrowError("State is required");
    });

    it("should throw an error when zip code is empty", () => {
        expect(() => {
            const address = new Address(
                expectedStreet,
                expectedNumber,
                expectedCity,
                expectedState,
                "",
                )
        }).toThrowError("Zip Code is required");
    });

    it("should create a new address", () => {
        // given
        const expectedStreet = "Rua Def";
        const expectedNumber = "456";
        const expectedComplement = "66";
        const expectedCity = "Novo Hamburgo";
        const expectedState = "Rio Grande do Sul";
        const expectedZipCode = "90666000";

        // when
        const address = new Address(
            expectedStreet,
            expectedNumber,
            expectedCity,
            expectedState,
            expectedZipCode
        );
        address.changeComplement(
            expectedComplement
        );

        // then
        expect(address.street).toBe(expectedStreet);
        expect(address.number).toBe(expectedNumber);
        expect(address.complement).toBe(expectedComplement);
        expect(address.city).toBe(expectedCity);
        expect(address.state).toBe(expectedState);
        expect(address.zipCode).toBe(expectedZipCode);
    });
});