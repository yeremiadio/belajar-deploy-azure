import { useCallback, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, GoogleMap, MarkerF } from '@react-google-maps/api';

import DrawerSubmitAction from '@/components/Form/DrawerSubmitAction';
import { GoogleMaps as CustomGoogleMaps } from '@/components/GoogleMaps';
import InputComponent from '@/components/InputComponent';
import { useToast } from '@/components/ui/use-toast';
import { useAddPinpointLocationMutation } from '@/stores/managementStore/locationStore/locationStoreApi';

import { ErrorMessageBackendDataShape } from '@/types/api';
import { ICoordinate } from '@/types/api/management/gateway';
import {
  ILocation,
  TAddPinpointLocationRequestFormObject,
} from '@/types/api/management/location';
import { TModalFormProps } from '@/types/modal';

import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import addPinpointValidationSchema from '@/utils/validations/management/location/addPinpointValidationSchema';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';

const AddPinpointForm = ({ toggle, data }: TModalFormProps<ILocation>) => {
  const isEditing = !!data?.coordinate?.lat && !!data?.coordinate?.lng;
  const { toast } = useToast();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [position, setPosition] = useState<ICoordinate | null>(
    data?.coordinate?.lat && data?.coordinate?.lng ? data.coordinate : null,
  );
  const [autocompleteGoogleMaps, setAutocompleteGoogleMaps] =
    useState<google.maps.places.Autocomplete>();
  let mapRef = useRef<GoogleMap>(null);
  const [addPinpointLocation, { isLoading: isLoadingAddPinpointLocation }] =
    useAddPinpointLocationMutation();
  const { control, handleSubmit, setValue } =
    useForm<TAddPinpointLocationRequestFormObject>({
      defaultValues: {
        address: '',
      },
      resolver: yupResolver(addPinpointValidationSchema),
      mode: 'onBlur',
      reValidateMode: 'onBlur',
    });

  const onPlaceChanged = () => {
    if (autocompleteGoogleMaps) {
      const location = autocompleteGoogleMaps.getPlace().geometry?.location;
      setValue('address', autocompleteGoogleMaps.getPlace().formatted_address);
      setPosition({
        lat: Number(location?.lat()),
        lng: Number(location?.lng()),
      });
      mapRef?.current?.panTo({
        lat: Number(location?.lat()),
        lng: Number(location?.lng()),
      });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };
  const onLoadAutocomplete = useCallback(function callback(
    autocomplete: google.maps.places.Autocomplete,
  ) {
    setAutocompleteGoogleMaps(autocomplete);
  }, []);
  const handleSubmitData = async () => {
    if (!data?.id || !position) return;
    await addPinpointLocation({
      id: data.id,
      lat: position.lat,
      lng: position.lng,
    })
      .unwrap()
      .then(() => {
        toggle();
        toast(
          generateDynamicToastMessage({
            title: 'Success',
            description: `Pinpoint ${isEditing ? 'saved' : 'created'} successfully`,
            variant: 'success',
          }),
        );
      })
      .catch((error: ErrorMessageBackendDataShape) => {
        const { title, message } = generateStatusCodesMessage(error.status);
        toast(
          generateDynamicToastMessage({
            title,
            description: `${message} "\n${error?.data?.message ?? ''}"`,
            variant: 'error',
          }),
        );
      });
  };

  const disableSubmitButton =
    !position ||
    isLoadingAddPinpointLocation ||
    (isEditing && position === data?.coordinate);

  return (
    <div>
      <form
        id="addPinpointForm"
        onSubmit={handleSubmit(handleSubmitData)}
        className="grid grid-cols-1 gap-4"
      >
        <Controller
          name="address"
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => {
            return isLoaded ? (
              <Autocomplete
                className="z-100"
                onLoad={onLoadAutocomplete}
                onPlaceChanged={onPlaceChanged}
              >
                <InputComponent
                  label="Location"
                  placeholder="Search Places..."
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                  errorMessage={error?.message}
                />
              </Autocomplete>
            ) : (
              <></>
            );
          }}
        />
        <CustomGoogleMaps
          ref={mapRef}
          onClick={(e) => {
            setPosition(e?.latLng?.toJSON() ?? null);
          }}
          onLoadedGoogleMaps={(isLoaded) => setIsLoaded(isLoaded)}
          mapContainerStyle={{
            height: 280,
            width: '100%',
          }}
          onLoad={(map) => {
            map.setCenter({
              lat: data?.coordinate?.lat ?? -6.298871493831486,
              lng: data?.coordinate?.lng ?? 106.83123255134737,
            });

            //@ts-ignore
            mapRef.current = map;
          }}
        >
          {position && <MarkerF position={position} />}
        </CustomGoogleMaps>
        <div className="grid grid-cols-2 gap-2">
          <InputComponent
            readOnly
            label="Latitude"
            placeholder="Latitude..."
            value={position?.lat ?? ''}
          />
          <InputComponent
            readOnly
            label="Longitude"
            placeholder="Longitude..."
            value={position?.lng ?? ''}
          />
        </div>
        <DrawerSubmitAction
          submitText={isEditing ? 'Edit Pinpoint' : 'Add Pinpoint'}
          disabled={disableSubmitButton}
          toggle={toggle}
          form="addPinpointForm"
        />
      </form>
    </div>
  );
};

export default AddPinpointForm;
