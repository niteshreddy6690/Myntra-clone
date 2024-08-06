import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import EditAddressModal from "./EditAddressModal"; // Adjust the import path as needed
import userEvent from "@testing-library/user-event";

describe("EditAddressModal", () => {
  const mockHandleShowEditModal = jest.fn();
  const mockCallEditApi = jest.fn();
  const editedAddress = {
    addressId: "1",
    name: "John Doe",
    mobileNumber: "1234567890",
    pinCode: "123456",
    state: "State",
    city: "City",
    addressType: "home",
    locality: "Locality",
    streetAddress: "123 Street",
    landmark: "Landmark",
    isDefault: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with initial values", () => {
    render(
      <EditAddressModal
        handleShowEditModal={mockHandleShowEditModal}
        callEditApi={mockCallEditApi}
        editedAddress={editedAddress}
      />
    );

    expect(screen.getByRole("textbox", { name: "Name *" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name *" })).toHaveValue(
      "John Doe"
    );
    expect(
      screen.getByRole("textbox", {
        name: /mobile number \*/i,
      })
    ).toHaveValue("1234567890");
    expect(screen.getByLabelText(/Pincode \*/)).toHaveValue("123456");
    expect(screen.getByLabelText(/State \*/)).toHaveValue("State");
    expect(screen.getByLabelText(/City\/ District \*/)).toHaveValue("City");
    expect(
      screen.getByLabelText(/Address \(House No, Building, Street, Area\) \*/)
    ).toHaveValue("123 Street");
    expect(screen.getByLabelText(/Locality\/ Town \*/)).toHaveValue("Locality");
  });

  test("shows validation errors on submit", async () => {
    render(
      <EditAddressModal
        handleShowEditModal={mockHandleShowEditModal}
        callEditApi={mockCallEditApi}
        editedAddress={editedAddress}
      />
    );

    const inputElement = screen.getByRole("textbox", { name: "Name *" });
    userEvent.clear(inputElement);

    userEvent.clear(screen.getByRole("textbox", { name: /mobile number \*/i }));

    userEvent.clear(
      screen.getByRole("textbox", {
        name: /pincode \*/i,
      })
    );
    // userEvent.type(inputElement, "test");

    await waitFor(() => {
      //   expect(screen.getByRole("textbox", { name: "Name *" })).toHaveValue(
      //     "test"
      //   );
      expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Please enter your phone number/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/please enter your area pin code/i)
      ).toBeInTheDocument();
    });
  });

  test("calls callEditApi with form data on submit", async () => {
    render(
      <EditAddressModal
        handleShowEditModal={mockHandleShowEditModal}
        callEditApi={mockCallEditApi}
        editedAddress={editedAddress}
      />
    );
    // userEvent.clear(screen.getByRole("textbox", { name: "Name *" }));
    userEvent.type(screen.getByRole("textbox", { name: "Name *" }), {
      target: { value: "John Doe" },
    });
    userEvent.click(screen.getByText(/Save/));

    await waitFor(() => {
      expect(mockCallEditApi).toHaveBeenCalledWith({
        addressId: "1",
        name: "John Doe",
        mobileNumber: "1234567890",
        pinCode: "123456",
        state: "State",
        city: "City",
        addressType: "home",
        locality: "Locality",
        streetAddress: "123 Street",
        landmark: "Landmark",
        isDefault: false,
      });
    });
  });

  test("calls handleShowEditModal when Cancel is clicked", () => {
    render(
      <EditAddressModal
        handleShowEditModal={mockHandleShowEditModal}
        callEditApi={mockCallEditApi}
        editedAddress={editedAddress}
      />
    );

    fireEvent.click(screen.getByText(/Cancel/));
    expect(mockHandleShowEditModal).toHaveBeenCalled();
  });
});
