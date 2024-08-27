import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import { setHtmlRefId } from '@/stores/htmlRefStore/htmlRefSlice';

import {
  OrderStatusEnum,
  TPurchaseOrderRequestFormObject,
} from '@/types/api/order';
import { ErrorMessageBackendDataShape } from '@/types/api';

import { yupResolver } from '@hookform/resolvers/yup';
import { ROUTES } from '@/utils/configs/route';
import purchaseOrderValidationSchema from '@/utils/validations/order/orderValidationSchema';
import generateDynamicToastMessage from '@/utils/functions/generateDynamicToastMessage';
import generateStatusCodesMessage from '@/utils/functions/generateStatusCodesMessage';
import getStatusPermissions from '@/utils/functions/order/getStatusPermissions';

import {
  useCreatePurchaseOrderMutation,
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
} from '@/stores/purchaseOrderStore/purchaseOrderApi';

import Copilot from '@/components/Copilot';
import TopBar from '@/components/TopBar';
import ContentWrapper from '@/components/Wrapper/ContentWrapper';
import PageWrapper from '@/components/Wrapper/PageWrapper';

import OrderInitiationForm from './_components/OrderInitiationForm';
import ConfirmInventoryTable from './_components/ConfirmInventoryTable';
import OrderDocumentTable from './_components/OrderDocumentTable';
import OrderDeliveryTable from './_components/OrderDeliveryTable';
import OrderInventoryTable from './_components/OrderInventoryTable';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const PurchaseOrderPage = () => {
  const htmlId = 'purchaseOrderId';
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('id') || undefined;
  const dispatch = useDispatch();

  const { data: orderData } = useGetPurchaseOrderByIdQuery(
    {
      id: Number(orderId),
    },
    {
      skip: !orderId,
    },
  );

  const permissions = getStatusPermissions(
    orderData?.status as OrderStatusEnum,
  );

  const OrderForm = useForm<TPurchaseOrderRequestFormObject>({
    defaultValues: {
      vendorId: undefined,
      address: '',
      groupInventoryId: undefined,
      deliveryDate: undefined,
      termsId: undefined,
      status: 'QUOTATION',
      inventoryList: [],
      tax: 0,
      discount: 0,
    },
    resolver: yupResolver(purchaseOrderValidationSchema),
    mode: 'all',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    dispatch(setHtmlRefId(htmlId));
  }, [dispatch]);

  useEffect(() => {
    if (orderData) {
      const transformedInventoryList =
        orderData?.inventoryList?.map((item) => ({
          id: item.inventory?.id,
          quantity: item.quantity,
          inventory: item.inventory,
        })) || [];

      OrderForm.reset({
        vendorId: orderData?.vendorId || undefined,
        address: orderData?.address || '',
        groupInventoryId: orderData?.groupInventoryId || undefined,
        deliveryDate: orderData?.deliveryDate || undefined,
        termsId: orderData?.termsId || undefined,
        status: orderData?.status || undefined,
        inventoryList: transformedInventoryList,
        tax: orderData?.tax || 0,
        discount: orderData?.discount || 0,
      });
    }
  }, [orderData]);

  const [createOrder] = useCreatePurchaseOrderMutation();
  const [updateOrder] = useUpdatePurchaseOrderMutation();

  const handleSubmit = (data: TPurchaseOrderRequestFormObject) => {
    const sanitizedData: TPurchaseOrderRequestFormObject = {
      ...data,
    };

    if (orderData) {
      updateOrder({ id: orderData.id, data: sanitizedData })
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Purchase Order is updated successfully',
              variant: 'success',
            }),
          );
          navigate(ROUTES.purchaseOrder);
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
    } else {
      createOrder(sanitizedData)
        .unwrap()
        .then(() => {
          toast(
            generateDynamicToastMessage({
              title: 'Success',
              description: 'Purchase Order is added successfully',
              variant: 'success',
            }),
          );
          navigate(ROUTES.purchaseOrder);
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
    }
  };

  return (
    <PageWrapper>
      <TopBar title="Purchase Order" isFloating={false} />
      <ContentWrapper id={htmlId}>
        <form id="purchaseOrderForm" className="flex w-full flex-col gap-4">
          {location && location.pathname === ROUTES.purchaseOrderCreate && (
            <>
              <OrderInitiationForm
                orderFormObject={OrderForm}
                orderId={orderId}
              />
              <OrderInventoryTable
                orderFormObject={OrderForm}
                orderId={orderId}
              />
              {orderData && (
                <>
                  <OrderDocumentTable
                    orderFormObject={OrderForm}
                    orderId={orderId}
                  />
                  <OrderDeliveryTable
                    orderFormObject={OrderForm}
                    orderId={orderId}
                  />
                </>
              )}

              <div className="flex w-full justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => navigate(ROUTES.purchaseOrder)}
                  className="btn-terinary-gray hover:hover-btn-terinary-gray"
                >
                  {orderData ? 'Back' : 'Cancel'}
                </Button>

                <Button
                  type="submit"
                  form="purchaseOrderForm"
                  // disabled={!isValid || !permissions.canChangeVendor}
                  // DocumentForm.formState.isSubmitting || !DocumentForm.formState.isValid
                  disabled={
                    !permissions.canChangeVendor ||
                    OrderForm.formState.isSubmitting ||
                    !OrderForm.formState.isValid
                  }
                  onClick={OrderForm.handleSubmit(handleSubmit)}
                  className="bg-rs-v2-mint hover:bg-rs-v2-mint/80"
                >
                  {orderData ? 'Save Order' : 'Create Order'}
                </Button>
              </div>
            </>
          )}
          {location &&
            location.pathname === ROUTES.purchaseOrderConfirmInventory && (
              <ConfirmInventoryTable formObject={OrderForm} />
            )}
        </form>
        <Copilot />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PurchaseOrderPage;
