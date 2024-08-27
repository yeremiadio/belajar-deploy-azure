import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { MdSearch } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { AvatarImage } from '@/assets/images';
import Card from '@/components/Card';
import GreenDot from '@/components/Dot/GreenDot';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  useGetEmployeeLocationsQuery,
  useGetEmployeeSummaryQuery,
} from '@/stores/employeeTrackerStore/employeeTrackerStoreApi';
import { selectLanguage } from '@/stores/languageStore/languageSlice';
import { TEmployeeLocationDetail } from '@/types/api/employeeTracker';
import { ROUTES } from '@/utils/configs/route';
import { localization } from '@/utils/functions/localization';
import useAppSelector from '@/utils/hooks/useAppSelector';

type Props = {
  selectedEmployee?: TEmployeeLocationDetail;
  toggleSelectedEmployee: (employee: TEmployeeLocationDetail) => void;
};

const EmployeeSummary: FC<Props> = ({
  selectedEmployee,
  toggleSelectedEmployee,
}) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<string>('');
  const accordionTriggerRef = useRef<HTMLDivElement>(null);

  const language = useAppSelector(selectLanguage);

  const { gatewayId } = useParams<'gatewayId'>();

  const { data: summaryData } = useGetEmployeeSummaryQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });
  const { data: employeesData } = useGetEmployeeLocationsQuery({
    gatewayId: gatewayId ? Number(gatewayId) : undefined,
  });

  const employeeList = useMemo(
    () =>
      employeesData?.employee?.map((item: TEmployeeLocationDetail) => ({
        ...item,
      })) || [],
    [employeesData],
  );

  useEffect(() => {
    if (selectedEmployee?.name !== selectedItem) {
      const employeeName = selectedEmployee?.name || '';
      setSelectedItem(employeeName);
      setTimeout(() => {
        const selectedElement = document.querySelector('[data-state="open"]');
        selectedElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);
    }
  }, [selectedEmployee, selectedItem]);

  return (
    <div className="grid h-full grid-flow-row overflow-hidden">
      <div className="h-fit">
        <h1 className="mb-4 text-xl">
          {localization('Employee Summary', language)}
        </h1>

        <Card
          className={cn(
            'grid max-h-24 w-auto grid-cols-3 overflow-x-auto rounded-md border-0 bg-rs-dark-card2 px-4 py-2 text-center shadow-[0px_2px_8px_0px_rgba(0,0,0,0.15)] lg:py-4',
          )}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {/* <p className="text-sm">{localization("Active", language)}</p> */}
              <p className="text-sm">{localization('Attended', language)}</p>
              <GreenDot />
            </div>
            <p className="text-xl font-bold">{summaryData?.attended || 0}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-sm">{localization('On Leave', language)}</p>
            <p className="text-xl font-bold">{summaryData?.onLeave || 0}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-sm">
              {localization('Total Employees', language)}
            </p>
            <p className="text-xl font-bold">
              {summaryData?.totalEmployee || 0}
            </p>
          </div>
        </Card>
      </div>

      <div className={`flex h-full flex-col gap-4 overflow-y-auto`}>
        <h1 className="mt-4 text-xl">
          {localization('Employee List', language)}
        </h1>
        <div className="px-1">
          <Input
            addonRight={<MdSearch className="h-[24px] w-[24px]" />}
            className="border-[1px] border-rs-v2-thunder-blue bg-rs-v2-navy-blue"
            type="search"
            placeholder="Search Employee..."
          />
        </div>

        <div className="flex h-full overflow-y-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={selectedEmployee?.name || selectedItem}
            onValueChange={(val) => setSelectedItem(val)}
          >
            {employeeList.map((item: TEmployeeLocationDetail) => {
              const isMatch = item.name === selectedItem;
              return (
                <AccordionItem
                  ref={accordionTriggerRef}
                  key={item.id}
                  className={cn(
                    'rounded-md px-3 transition-all ease-in-out',
                    isMatch ? 'bg-rs-v2-slate-blue-60%' : 'bg-transparent',
                  )}
                  value={item.name}
                  // onClick={() => {
                  //   toggleSelectedEmployee(item);
                  // }}
                >
                  <AccordionTrigger
                    className="hover:no-underline"
                    onClick={() => {
                      toggleSelectedEmployee(item);
                    }}
                  >
                    <div className="flex w-full justify-between gap-6">
                      <div className="flex items-center gap-2">
                        <img
                          src={AvatarImage}
                          className="h-[40px] w-[40px] rounded-full bg-cover"
                        />
                        <div className="flex flex-col items-start gap-[2px]">
                          <span>{item.name}</span>
                          <p className="m-0 text-sm text-rs-neutral-dark-platinum">
                            {item.position}
                          </p>
                        </div>
                      </div>
                      {!isMatch ? (
                        <div className="flex items-center gap-2 pr-2">
                          <div className="flex flex-col items-end gap-[2px]">
                            <span className="text-sm text-rs-v2-light-grey">
                              {localization('Current Location', language)}
                            </span>
                            <p className="m-0 text-sm text-rs-v2-mint">
                              {item.location}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-md bg-rs-v2-galaxy-blue px-4 py-3">
                      <p className="text-sm text-rs-neutral-gray-gull">
                        {localization('Current Location', language)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-3 w-3 rounded-full bg-rs-v2-mint" />
                          <p className="text-sm font-semibold">
                            {item.location}
                          </p>
                        </div>
                        <p className="text-sm">09:20</p>
                      </div>
                      <p className="mt-3 text-right text-[11px] font-thin text-rs-neutral-gray-gull">
                        {localization('Last Updated', language)}
                        {': '}
                        {item.lastUpdateInMin} minutes ago
                      </p>
                    </div>
                    <Button
                      className="mt-3 w-full bg-rs-v2-midnight-blue text-white hover:bg-rs-v2-midnight-blue"
                      onClick={() =>
                        navigate(
                          gatewayId
                            ? ROUTES.employeeTrackerGatewayDetail(
                                gatewayId,
                                item.id.toString(),
                              )
                            : ROUTES.employeeTrackerDetail + `?id=${item.id}`,
                        )
                      }
                    >
                      {localization('View Detail', language)}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSummary;
