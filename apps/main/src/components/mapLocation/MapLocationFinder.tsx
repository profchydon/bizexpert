"use client";

import { GooglePlacesScript } from "@/components/GooglePlacesScript";
import { forwardRef, useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import {
  buildOfficeLocation,
  countryMismatchError,
  parseAddressComponents,
  streetAddressError,
} from "./addressParts";
import type { MapLocationFinderProps } from "./types";

const MapLocationFinder = forwardRef<HTMLInputElement, MapLocationFinderProps>(
  (props, ref) => {
    const {
      getOfficeLocation,
      children,
      defaultValue,
      reset,
      label,
      placeholder = "Start typing address here...",
      specificCountry = null,
      disabled = false,
    } = props;

    const [address, setAddress] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
      if (defaultValue) {
        setAddress(
          typeof defaultValue === "object"
            ? defaultValue.address
            : defaultValue,
        );
      }
    }, [defaultValue]);

    useEffect(() => {
      if (reset) {
        setAddress("");
        setErrorMessage("");
      }
    }, [reset]);

    const handleSelect = async (selectedAddress: string) => {
      try {
        const results = await geocodeByAddress(selectedAddress);
        const latLng = await getLatLng(results[0]);
        const parsed = parseAddressComponents(results[0].address_components);
        const streetError = streetAddressError(parsed);
        if (streetError) {
          setErrorMessage(streetError);
          setAddress("");
          getOfficeLocation(buildOfficeLocation("", latLng, parsed));
          return;
        }
        const countryError = countryMismatchError(parsed, specificCountry);
        if (countryError) {
          setErrorMessage(countryError);
          setAddress("");
          getOfficeLocation(buildOfficeLocation("", latLng, parsed));
          return;
        }
        setAddress(selectedAddress);
        setErrorMessage("");
        getOfficeLocation(buildOfficeLocation(selectedAddress, latLng, parsed));
      } catch (error) {
        setErrorMessage("Error retrieving address details. Please try again.");
        console.error("Error geocoding address:", error);
      }
    };

    const searchOptions = {
      types: ["address"],
      componentRestrictions: specificCountry
        ? { country: [specificCountry] }
        : undefined,
    };

    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor="address"
            className="mb-[0.36rem] block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <PlacesAutocomplete
          value={address}
          onChange={(nextAddress) => {
            setAddress(nextAddress);
            setErrorMessage("");
          }}
          onSelect={handleSelect}
          searchOptions={searchOptions}
          googleCallbackName="mapFinder"
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div className="w-full bg-white items-center border rounded-lg border-gray-200 shadow-gray-100">
              <input
                ref={ref}
                {...getInputProps({
                  placeholder,
                  style: { height: "2.7rem", padding: "0.625rem 0.875rem" },
                  className:
                    "outline-none w-full border-0 rounded-lg placeholder:text-sm",
                  id: "address",
                  disabled,
                })}
              />
              <div
                className="autocomplete-dropdown-container"
                style={{
                  position: "absolute",
                  backgroundColor: "white",
                  zIndex: 2,
                }}
              >
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className: suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item",
                      style: {
                        backgroundColor: "#fafafa",
                        cursor: "pointer",
                        padding: "5px 20px",
                      },
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
        <GooglePlacesScript />
        {errorMessage && (
          <p className="text-error-500 text-sm mt-1">{errorMessage}</p>
        )}
        {children}
      </div>
    );
  },
);

MapLocationFinder.displayName = "MapLocationFinder";

export default MapLocationFinder;
