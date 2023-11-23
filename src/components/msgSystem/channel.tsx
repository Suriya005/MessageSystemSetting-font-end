import React from 'react';
import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Select from 'react-select';

import { DataTable } from 'mantine-datatable';

const rowData = [
    {
        id: 'ObjectId("654dc88e5fde0679c97f5afa")',
        name: 'Gmail',
        desc: 'Personal google email.',
        credential: {
            username: 'username1',
            password: '<PASSWORD>',
        },
        status: 'inactive',
    },
    {
        id: 'ObjectId("654dc88e5fde0679c97f5afb")',
        name: 'AWS',
        desc: 'Personal AWS.',
        credential: {
            username: 'username2',
            password: '<PASSWORD>',
        },
        status: 'active',
    },
    {
        id: 'ObjectId("654dc88e5fde0679c97f5afc")',
        name: 'SendGrid',
        desc: 'Personal SendGrid.',
        credential: {
            username: 'username3',
            password: '<PASSWORD>',
        },
        status: 'active',
    },
];
const rowDataChannel = [
    {
        _id: 'ObjectId("654dc95d5fde0679c97f5afb")',
        name: 'Email',
        desc: 'Personal email.',
        providerId: [{
            id:'ObjectId("654dc88e5fde0679c97f5afa")',
            name:'Gmail',
        }],
        status: 'inactive',
    },
    {
        _id: 'ObjectId("654dc95d5fde0679c97f5afc")',
        name: 'SMS',
        desc: 'Personal SMS.',
        providerId: [{
            id:'ObjectId("654dc88e5fde0679c97f5afb")',
            name:'Gmail',
        }],
        status: 'active',
    },
    {
        _id: 'ObjectId("654dc95d5fde0679c97f5afd")',
        name: 'Push',
        desc: 'Personal Push.',
        providerId: [{
            id:'ObjectId("654dc88e5fde0679c97f5afc")',
            name:'SendGrid',
        }],
        status: 'active',
    },
];

export default function MsgChannel() {
    const PAGE_SIZES = [10, 20, 30, 50, 100];

    // Channel zone
    const [pageChannel, setPageChannel] = useState(1);
    const [pageSizeChannel, setPageSizeChannel] = useState(PAGE_SIZES[0]);
    const [initialRecordsChannel, setInitialRecordsChannel] = useState(rowDataChannel);
    const [recordsDataChannel, setRecordsDataChannel] = useState(initialRecordsChannel);
    const [searchChannel, setSearchChannel] = useState('');
    const [filterChannel, setFilterChannel] = useState('');
    const [modalEditChannel, setModalEditChannel] = useState(false);
    const [modalAddChannel, setModalAddChannel] = useState(false);
    const [modalDeleteChannel, setModalDeleteChannel] = useState(false);
    const [providerSelected, setProviderSelected] = useState<{ value: string; label: string }[]>([]);
    const [dataForEditChannel, setDataForEditChannel] = useState({
        id: '',
        name: '',
        desc: '',
        providerId: [],
        status: '',
    } as any);
    const [statusToggleChannel, setStatusToggleChannel] = useState(false);
    const handleChangeChannel = (event: any) => {
        const { name, value } = event.target;
        setDataForEditChannel((dataForEditChannel: any) => ({
            ...dataForEditChannel,
            [name]: value,
        }));
    };
    const openEditModalChannel = (data: any) => {
        setProviderSelected([]);
        rowData.map((item) => {
            setProviderSelected((providerSelected) => [...providerSelected, { value: item.id, label: item.name }]);
        });
        data.status === 'active' ? setStatusToggleChannel(true) : setStatusToggleChannel(false);
        setDataForEditChannel(data);
        setModalEditChannel(true);
    };
    const openAddModalChannel = () => {
        rowData.map((item) => {
            setProviderSelected((providerSelected) => [...providerSelected, { value: item.id, label: item.name }]);
        });
        setModalAddChannel(true);
    };
    useEffect(() => {
        setPageChannel(1);
    }, [pageSizeChannel]);
    useEffect(() => {
        const from = (pageChannel - 1) * pageSizeChannel;
        const to = from + pageSizeChannel;
        setRecordsDataChannel([...initialRecordsChannel.slice(from, to)]);
    }, [pageChannel, pageSizeChannel, initialRecordsChannel]);
    useEffect(() => {
        setInitialRecordsChannel(() => {
            return rowDataChannel.filter((item) => {
                return (
                    item._id.toString().includes(searchChannel.toLowerCase()) ||
                    item.name.toLowerCase().includes(searchChannel.toLowerCase()) ||
                    item.status.toLowerCase().includes(searchChannel.toLowerCase()) ||
                    item.providerId[0].name.toLowerCase().includes(searchChannel.toLowerCase())
                );
            });
        });
    }, [searchChannel]);
    useEffect(() => {
        setInitialRecordsChannel(() => {
            return rowDataChannel.filter((item) => {
                const searchfilter = filterChannel === 'active' ? 'active' : filterChannel === 'inactive' ? 'inactive' : '';
                if (searchfilter === 'active') {
                    return (
                        (item._id.toString().includes(searchChannel.toLowerCase()) ||
                            item.name.toLowerCase().includes(searchChannel.toLowerCase()) ||
                            item.status.toLowerCase().includes(searchChannel.toLowerCase())) &&
                        item.status === 'active'
                    );
                } else if (searchfilter === 'inactive') {
                    return (
                        (item._id.toString().includes(searchChannel.toLowerCase()) ||
                            item.name.toLowerCase().includes(searchChannel.toLowerCase()) ||
                            item.status.toLowerCase().includes(searchChannel.toLowerCase())) &&
                        item.status === 'inactive'
                    );
                } else {
                    return (
                        item._id.toString().includes(searchChannel.toLowerCase()) ||
                        item.name.toLowerCase().includes(searchChannel.toLowerCase()) ||
                        item.status.toLowerCase().includes(searchChannel.toLowerCase())
                    );
                }
            });
        });
    }, [filterChannel]);
    return (
        <div>
            <div className="active pt-5">
                <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    <div className="panel h-full xl:col-span-3">
                        <div className="panel">
                            <div className="flex items-center justify-end mb-5">
                                <h5 className="mr-3 font-semibold text-lg dark:text-white-light">
                                    <button
                                        onClick={() => setModalAddChannel(true)}
                                        type="button"
                                        className="btn
                                                bg-[#2684FC] text-white-light hover:bg-[#2684FC] hover:text-white-light"
                                    >
                                        + Add new
                                    </button>
                                </h5>
                                <div className=" mr-3">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-1 pl-5 pr-1 flex items-center pointer-events-none">
                                            <svg width="11" height="4" viewBox="0 0 11 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path opacity="0.8" d="M1 1L5.44643 3L9.89286 1" stroke="black" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <select id="filter" name="filter" value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)} className="form-input w-auto pr-5">
                                            <option selected>Filter</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 right-1 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                    </div>
                                    <input className="form-input w-auto pr-4" placeholder="Search..." value={searchChannel} onChange={(e) => setSearchChannel(e.target.value)} />
                                </div>
                            </div>

                            <div className="datatables">
                                <DataTable
                                    striped
                                    className="whitespace-nowrap table-striped"
                                    records={recordsDataChannel}
                                    columns={[
                                        { accessor: 'name', title: 'Channel' },
                                        { accessor: 'desc', title: 'Description' },
                                        {
                                            accessor: 'providerId[0].name',
                                            title: 'Provider',
                                            width: '200px',
                                        },
                                        {
                                            accessor: 'status',
                                            title: 'status',
                                            width: '200px',
                                            render: ({ status }) => {
                                                if (status === 'active') {
                                                    return <span className="text-green-500">Active</span>;
                                                } else if (status === 'inactive') {
                                                    return <span className="text-red-500">Inactive</span>;
                                                } else if (status === 'pending') {
                                                    return <span className="text-yellow-500">Pending</span>;
                                                } else {
                                                    return <span className="text-gray-500">Unknown</span>;
                                                }
                                            },
                                        },
                                        
                                        {
                                            accessor: 'actions',
                                            title: '',
                                            // align: 'center',
                                            width: '200px',
                                            render: (item) => {
                                                return (
                                                    <>
                                                        <div className="flex justify-around">
                                                            <button type="button" onClick={() => openEditModalChannel(item)} className="btn btn-warning">
                                                                <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M9.79061 3.54168H5.59307C5.14777 3.54168 4.72071 3.69094 4.40583 3.95661C4.09096 4.22229 3.91406 4.58262 3.91406 4.95835V12.75C3.91406 13.1257 4.09096 13.4861 4.40583 13.7517C4.72071 14.0174 5.14777 14.1667 5.59307 14.1667H14.8276C15.2729 14.1667 15.7 14.0174 16.0149 13.7517C16.3298 13.4861 16.5067 13.1257 16.5067 12.75V9.20835M15.3196 2.5401C15.4745 2.40479 15.6597 2.29687 15.8646 2.22262C16.0694 2.14837 16.2898 2.10929 16.5127 2.10766C16.7356 2.10602 16.9567 2.14187 17.1631 2.2131C17.3694 2.28433 17.5569 2.38952 17.7145 2.52254C17.8722 2.65555 17.9968 2.81373 18.0813 2.98783C18.1657 3.16193 18.2082 3.34848 18.2062 3.53658C18.2043 3.72469 18.158 3.91058 18.07 4.08342C17.982 4.25626 17.8541 4.41258 17.6937 4.54326L10.4857 10.625H8.11159V8.62185L15.3196 2.5401Z"
                                                                        stroke="white"
                                                                        stroke-width="2"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            <button type="button" onClick={() => setModalDeleteChannel(true)} className="btn btn-danger">
                                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        d="M7.5 8.25003V12.75M10.5 8.25003V12.75M3 5.25003H15M14.25 5.25003L13.5997 14.3565C13.5728 14.735 13.4035 15.0891 13.1258 15.3477C12.8482 15.6063 12.4829 15.75 12.1035 15.75H5.8965C5.5171 15.75 5.1518 15.6063 4.87416 15.3477C4.59653 15.0891 4.42719 14.735 4.40025 14.3565L3.75 5.25003H14.25ZM11.25 5.25003V3.00003C11.25 2.80112 11.171 2.61035 11.0303 2.4697C10.8897 2.32905 10.6989 2.25003 10.5 2.25003H7.5C7.30109 2.25003 7.11032 2.32905 6.96967 2.4697C6.82902 2.61035 6.75 2.80112 6.75 3.00003V5.25003H11.25Z"
                                                                        stroke="white"
                                                                        stroke-linecap="round"
                                                                        stroke-linejoin="round"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </>
                                                );
                                            },
                                        },
                                    ]}
                                    totalRecords={initialRecordsChannel.length}
                                    recordsPerPage={pageSizeChannel}
                                    page={pageChannel}
                                    onPageChange={(p) => setPageChannel(p)}
                                    // recordsPerPageOptions={PAGE_SIZES}
                                    // onRecordsPerPageChange={setPageSizeChannel}
                                    minHeight={200}
                                    paginationText={({ from, to, totalRecords }) => ``}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal zone */}

            {/* edit */}
            <Transition appear show={modalEditChannel} as={Fragment}>
                <Dialog as="div" open={modalEditChannel} onClose={() => setModalEditChannel(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-visible my-8 w-full max-w-xl text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Edit Channel</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAddChannel(false)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        <form>
                                            <div className="flex items-center justify-end my-4 mr-5">
                                                <label htmlFor="">Channel</label>
                                                <input
                                                    value={dataForEditChannel.name}
                                                    onChange={handleChangeChannel}
                                                    name="name"
                                                    type="text"
                                                    placeholder=""
                                                    className="w-96 ml-5 form-input text-base"
                                                    required
                                                />
                                            </div>
                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Description</label>
                                                <textarea
                                                    value={dataForEditChannel.desc}
                                                    onChange={handleChangeChannel}
                                                    name="desc"
                                                    placeholder=""
                                                    className="w-96 ml-5 form-input text-base"
                                                    required
                                                />
                                            </div>

                                            <div className="flex items-start justify-end my-4 mr-5 overflow-visible">
                                                <label htmlFor="">Provider</label>
                                                <div className="w-96 ml-5 text-base">
                                                    <Select defaultValue={providerSelected[0]} options={providerSelected} isMulti isSearchable={false} />
                                                </div>
                                            </div>
                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Status</label>
                                                <div className="w-96 ml-5 flex items-center">
                                                    <label className="w-12 h-6 relative">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id="custom_switch_checkbox1"
                                                            checked={statusToggleChannel}
                                                            onChange={() => setStatusToggleChannel(!statusToggleChannel)}
                                                        />
                                                        <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                    </label>
                                                    {statusToggleChannel ? <span className="text-sm text-success px-5">Active</span> : <span className="text-sm text-danger px-5">Inactive</span>}
                                                </div>
                                            </div>
                                        </form>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModalAddChannel(false)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModalAddChannel(false)}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* add */}
            <Transition appear show={modalAddChannel} as={Fragment}>
                <Dialog as="div" open={modalAddChannel} onClose={() => setModalAddChannel(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-visible my-8 w-full max-w-xl text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold">Add Channel</div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAddChannel(false)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        <form>
                                            <div className="flex items-center justify-end my-4 mr-5">
                                                <label htmlFor="">Channel</label>
                                                <input type="text" placeholder="" className="w-96 ml-5 form-input text-base" required />
                                            </div>
                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Description</label>
                                                <textarea placeholder="" className="w-96 ml-5 form-input text-base" required />
                                            </div>

                                            <div className="flex items-start justify-end my-4 mr-5 overflow-visible">
                                                <label htmlFor="">Provider</label>
                                                <div className="w-96 ml-5 text-base">
                                                    <Select defaultValue={providerSelected[0]} options={providerSelected} isMulti isSearchable={false} />
                                                </div>
                                            </div>
                                            <div className="flex items-start justify-end my-4 mr-5">
                                                <label htmlFor="">Status</label>
                                                <div className="w-96 ml-5 flex items-center">
                                                    <label className="w-12 h-6 relative">
                                                        <input
                                                            type="checkbox"
                                                            className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                            id="custom_switch_checkbox1"
                                                            checked={statusToggleChannel}
                                                            onChange={() => setStatusToggleChannel(!statusToggleChannel)}
                                                        />
                                                        <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                    </label>
                                                    {statusToggleChannel ? <span className="text-sm text-success px-5">Active</span> : <span className="text-sm text-danger px-5">Inactive</span>}
                                                </div>
                                            </div>
                                        </form>

                                        <div className="flex justify-end items-center mt-8">
                                            <button type="button" className="btn btn-outline-danger" onClick={() => setModalAddChannel(false)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModalAddChannel(false)}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* delete */}
            <Transition appear show={modalDeleteChannel} as={Fragment}>
                <Dialog as="div" open={modalDeleteChannel} onClose={() => setModalDeleteChannel(false)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0" />
                    </Transition.Child>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-md text-black dark:text-white-dark">
                                    <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                        <div className="text-lg font-bold"></div>
                                        <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalDeleteChannel(false)}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="p-5 flex flex-col justify-center items-center">
                                        <svg className="my-3" width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M15.333 19.6667V33.6667M24.6663 19.6667V33.6667M1.33301 10.3333H38.6663M36.333 10.3333L34.31 38.6647C34.2262 39.842 33.6994 40.9439 32.8356 41.7483C31.9718 42.5528 30.8353 43 29.655 43H10.3443C9.164 43 8.0275 42.5528 7.16374 41.7483C6.29998 40.9439 5.77315 39.842 5.68934 38.6647L3.66634 10.3333H36.333ZM26.9997 10.3333V3.33333C26.9997 2.71449 26.7538 2.121 26.3163 1.68342C25.8787 1.24583 25.2852 1 24.6663 1H15.333C14.7142 1 14.1207 1.24583 13.6831 1.68342C13.2455 2.121 12.9997 2.71449 12.9997 3.33333V10.3333H26.9997Z"
                                                stroke="#848080"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                        <span>Are you sure to delete channel ?</span>
                                        <span>If you delete this channel you can’t recover it.</span>
                                        <div className="flex flex-row mt-3">
                                            <button type="button" className="btn btn-outline-dark mx-2">
                                                No, cancel
                                            </button>
                                            <button type="button" className="btn btn-danger mx-2">
                                                Yes, I’m sure
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
