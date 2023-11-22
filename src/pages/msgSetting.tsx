import { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import { setPageTitle } from '../store/themeConfigSlice';

import { DataTable } from 'mantine-datatable';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Dialog, Transition } from '@headlessui/react';
import { Tab } from '@headlessui/react';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
        providerId: ['ObjectId("654dc88e5fde0679c97f5afa")'],
        status: 'inactive',
    },
    {
        _id: 'ObjectId("654dc95d5fde0679c97f5afc")',
        name: 'SMS',
        desc: 'Personal SMS.',
        providerId: ['ObjectId("654dc88e5fde0679c97f5afb")'],
        status: 'active',
    },
    {
        _id: 'ObjectId("654dc95d5fde0679c97f5afd")',
        name: 'Push',
        desc: 'Personal Push.',
        providerId: ['ObjectId("654dc88e5fde0679c97f5afc")'],
        status: 'active',
    },
];

const rowDataType = [
    {
        id: 'ObjectId("654dc95d5fde0679c97f5afb")',
        name: 'Login alert',
        desc: 'Send email notification when login success.',
        msgChannelId: 'ObjectId("654dc88e5fde0679c97f5afa")',
        status: 'inactive',
    },
    {
        id: 'ObjectId("654dc95d5fde0679c97f5afc")',
        name: 'Forgot password alert',
        desc: 'Send email notification when forgot password success.',
        msgChannelId: 'ObjectId("654dc88e5fde0679c97f5afb")',
        status: 'active',
    },
    {
        id: 'ObjectId("654dc95d5fde0679c97f5afd")',
        name: 'Contact us',
        desc: 'Send email notification when contact us.',
        msgChannelId: 'ObjectId("654dc88e5fde0679c97f5afc")',
        status: 'active',
    },
];
const rowTemplateData = [
    {
        id: 'ObjectId("654dccf35fde0679c97f5afd")',
        name: 'Forgot Password',
        desc: 'Forgot Password Email.',
        messageTypeId: 'ObjectId("654dc9c65fde0679c97f5afc")',
        content: {
            subject: 'Complete your password reset request',
            body: `<h1><span class="il">Reset</span>&nbsp;your&nbsp;<span class="il">password</span></h1>
<p><span class="il">Hi John,</span></p>
<p><span class="il">Let's reset your password so you can get back to login.</span></p>
<table style="border-collapse: collapse; width: 100%;" border="1">
<tbody>
<tr>
<td style="width: 700px; text-align: center;"><strong>Reset Password</strong></td>
</tr>
</tbody>
</table>
<p><span class="il">If you did not ask to reset your password you may want to review your recent account access for any unusual activity.</span></p>
<p><span class="il">We're here to help if you need it. Visit the Help Center for more info or contact us.<br /></span></p>
<p><strong><span class="il">The BBO team</span></strong></p>`,
        },
        status: 'inactive',
    },
    {
        id: 'ObjectId("654dccf35fde0679c97f5afd")',
        name: 'Contact Us',
        desc: 'Contact Us Email.',
        messageTypeId: 'ObjectId("654dc9c65fde0679c97f5afc")',
        content: {
            subject: 'Contact Us Email Subject',
            body: `<h1><span class="il">Contact</span>&nbsp;Us</h1>`,
        },
        status: 'active',
    },
];

const msgSetting = () => {
    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    const [loading] = useState(false);
    const [currentTabName, setCurrentTabName] = useState('Provider');

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Message Setting'));
    });

    // Provider zone
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(rowData);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [modal1, setModal1] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [statusToggleProvider, setStatusToggleProvider] = useState(false);
    const [dataForEditProvider, setDataForEditProvider] = useState({
        id: '',
        name: '',
        desc: '',
        credential: {
            username: '',
            password: '',
        },
        status: '',
    } as any);
    const handleChangeProvider = (event: any) => {
        const { name, value } = event.target;
        // if object
        if (name.includes('credential')) {
            const [key, subKey] = name.split(':');
            setDataForEditProvider((dataForEditProvider: any) => ({
                ...dataForEditProvider,
                [key]: {
                    ...dataForEditProvider[key],
                    [subKey]: value,
                },
            }));
            return;
        } else {
            setDataForEditProvider((dataForEditProvider: any) => ({
                ...dataForEditProvider,
                [name]: value,
            }));
        }
    };
    const openEditModal = (data: any) => {
        data.status === 'active' ? setStatusToggleProvider(true) : setStatusToggleProvider(false);
        setDataForEditProvider(data);
        setModal1(true);
    };

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };
    useEffect(() => {
        setPage(1);
    }, [pageSize]);
    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize, initialRecords]);
    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return item.id.toString().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()) || item.status.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search]);
    useEffect(() => {
        setInitialRecords(() => {
            return rowData.filter((item) => {
                return item.id.toString().includes(search.toLowerCase()) || item.name.toLowerCase().includes(search.toLowerCase()) || item.status.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [filter]);

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
    const [passwordShownChannel, setPasswordShownChannel] = useState(false);
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
                    item.status.toLowerCase().includes(searchChannel.toLowerCase())
                );
            });
        });
    }, [searchChannel]);
    useEffect(() => {
        setInitialRecordsChannel(() => {
            return rowDataChannel.filter((item) => {
                return (
                    item._id.toString().includes(searchChannel.toLowerCase()) ||
                    item.name.toLowerCase().includes(searchChannel.toLowerCase()) ||
                    item.status.toLowerCase().includes(searchChannel.toLowerCase())
                );
            });
        });
    }, [filterChannel]);

    // Type zone
    const [pageType, setPageType] = useState(1);
    const [pageSizeType, setPageSizeType] = useState(PAGE_SIZES[0]);
    const [initialRecordsType, setInitialRecordsType] = useState(rowDataType);
    const [recordsDataType, setRecordsDataType] = useState(initialRecordsType);
    const [searchType, setSearchType] = useState('');
    const [filterType, setFilterType] = useState('');
    const [modalEditType, setModalEditType] = useState(false);
    const [modalAddType, setModalAddType] = useState(false);
    const [modalDeleteType, setModalDeleteType] = useState(false);
    const [passwordShownType, setPasswordShownType] = useState(false);

    interface IChannel {
        value: string;
        label: string;
    }
    const [channelSelected, setChannelSelected] = useState<IChannel[]>([]);
    const [dataForEditType, setDataForEditType] = useState({
        id: '',
        name: '',
        desc: '',
        msgChannelId: '',
        status: '',
    } as any);
    const [statusToggleType, setStatusToggleType] = useState(false);
    const handleChangeType = (event: any) => {
        const { name, value } = event.target;
        setDataForEditType((dataForEditType: any) => ({
            ...dataForEditType,
            [name]: value,
        }));
    };

    const openEditModalType = (data: any) => {
        setChannelSelected([]);
        rowDataChannel.map((item) => {
            setChannelSelected((channelSelected) => [...channelSelected, { value: item._id, label: item.name }]);
        });
        data.status === 'active' ? setStatusToggleType(true) : setStatusToggleType(false);
        setDataForEditType(data);
        setModalEditType(true);
    };
    const openAddModalType = () => {
        rowDataChannel.map((item) => {
            console.log(item);
            setChannelSelected((channelSelected) => [...channelSelected, { value: item._id, label: item.name }]);
        });
        setModalAddType(true);
    };
    useEffect(() => {
        setPageType(1);
    }, [pageSizeType]);
    useEffect(() => {
        const from = (pageType - 1) * pageSizeType;
        const to = from + pageSizeType;
        setRecordsDataType([...initialRecordsType.slice(from, to)]);
    }, [pageType, pageSizeType, initialRecordsType]);
    useEffect(() => {
        setInitialRecordsType(() => {
            return rowDataType.filter((item) => {
                return (
                    item.id.toString().includes(searchType.toLowerCase()) || item.name.toLowerCase().includes(searchType.toLowerCase()) || item.status.toLowerCase().includes(searchType.toLowerCase())
                );
            });
        });
    }, [searchType]);
    useEffect(() => {
        setInitialRecordsType(() => {
            return rowDataType.filter((item) => {
                return (
                    item.id.toString().includes(searchType.toLowerCase()) || item.name.toLowerCase().includes(searchType.toLowerCase()) || item.status.toLowerCase().includes(searchType.toLowerCase())
                );
            });
        });
    }, [filterType]);

    // template zone
    const [pageTemplate, setPageTemplate] = useState(1);
    const [pageSizeTemplate, setPageSizeTemplate] = useState(PAGE_SIZES[0]);
    const [initialRecordsTemplate, setInitialRecordsTemplate] = useState(rowTemplateData);
    const [recordsDataTemplate, setRecordsDataTemplate] = useState(initialRecordsTemplate);
    const [searchTemplate, setSearchTemplate] = useState('');
    const [filterTemplate, setFilterTemplate] = useState('');
    const [modalEditTemplate, setModalEditTemplate] = useState(false);
    const [modalAddTemplate, setModalAddTemplate] = useState(false);
    const [modalDeleteTemplate, setModalDeleteTemplate] = useState(false);
    const [passwordShownTemplate, setPasswordShownTemplate] = useState(false);

    interface IType {
        value: string;
        label: string;
    }
    const [typeSelected, setTypeSelected] = useState<IType[]>([]);
    const [dataForEditTemplate, setDataForEditTemplate] = useState({
        id: '',
        name: '',
        desc: '',
        messageTypeId: '',
        content: {
            subject: '',
            body: '',
        },
        status: '',
    } as any);
    const [statusToggleTemplate, setStatusToggleTemplate] = useState(false);

    const [templateValue, setTemplateValue] = useState('');
    const handleChangeTemplate = (event: any) => {
        const { name, value } = event.target;
        setDataForEditTemplate((dataForEditTemplate: any) => ({
            ...dataForEditTemplate,
            [name]: value,
        }));
    };

    const openEditModalTemplate = (data: any) => {
        setTemplateValue('');
        setTypeSelected([]);
        rowDataType.map((item) => {
            setTypeSelected((typeSelected) => [...typeSelected, { value: item.id, label: item.name }]);
        });

        data.status === 'active' ? setStatusToggleTemplate(true) : setStatusToggleTemplate(false);
        setDataForEditTemplate(data);
        setModalEditTemplate(true);
    };
    const openAddModalTemplate = () => {
        setTemplateValue('');
        rowDataType.map((item) => {
            setTypeSelected((typeSelected) => [...typeSelected, { value: item.id, label: item.name }]);
        });
        setModalAddTemplate(true);
    };
    useEffect(() => {
        setPageTemplate(1);
    }, [pageSizeTemplate]);
    useEffect(() => {
        const from = (pageTemplate - 1) * pageSizeTemplate;
        const to = from + pageSizeTemplate;
        setRecordsDataTemplate([...initialRecordsTemplate.slice(from, to)]);
    }, [pageTemplate, pageSizeTemplate, initialRecordsTemplate]);
    useEffect(() => {
        setInitialRecordsTemplate(() => {
            return rowTemplateData.filter((item) => {
                return (
                    item.id.toString().includes(searchTemplate.toLowerCase()) ||
                    item.name.toLowerCase().includes(searchTemplate.toLowerCase()) ||
                    item.status.toLowerCase().includes(searchTemplate.toLowerCase())
                );
            });
        });
    }, [searchTemplate]);
    useEffect(() => {
        setInitialRecordsTemplate(() => {
            return rowTemplateData.filter((item) => {
                return (
                    item.id.toString().includes(searchTemplate.toLowerCase()) ||
                    item.name.toLowerCase().includes(searchTemplate.toLowerCase()) ||
                    item.status.toLowerCase().includes(searchTemplate.toLowerCase())
                );
            });
        });
    }, [filterTemplate]);

    return (
        <div>
            <h1 className="font-bold text-xl">
                System Setting / Message{' '}
                {currentTabName === 'Provider' ? 'Provider' : currentTabName === 'Channel' ? 'Channel' : currentTabName === 'Type' ? 'Type' : currentTabName === 'Template' ? 'Template' : ''}
            </h1>
            <Tab.Group>
                <Tab.List className="mt-3 flex flex-wrap border-b border-white-light dark:border-[#191e3a]">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Provider')}
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                            >
                                Provider
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Channel')}
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                            >
                                Channel
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Type')}
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                            >
                                Type
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Template')}
                                className={`${selected ? '!border-white-light !border-b-white  text-primary !outline-none dark:!border-[#191e3a] dark:!border-b-black' : ''}
                    dark:hover:border-b-black -mb-[1px] block border border-transparent p-3.5 py-2 hover:text-primary`}
                            >
                                Template
                            </button>
                        )}
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    {/* Provider content */}
                    <Tab.Panel>
                        <div className="active pt-5">
                            <div className="grid xl:grid-cols-3 gap-6 mb-6">
                                <div className="panel h-full xl:col-span-3">
                                    <div className="panel">
                                        <div className="flex items-center justify-end mb-5">
                                            <h5 className="mr-3 font-semibold text-lg dark:text-white-light">
                                                <button onClick={() => setModalAdd(true)} type="button" className="btn btn-primary">
                                                    Add
                                                </button>
                                            </h5>
                                            <div className=" mr-3">
                                                <select id="filter" className="form-input w-auto select form">
                                                    <option selected>Filter</option>
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="FR">France</option>
                                                    <option value="DE">Germany</option>
                                                </select>
                                            </div>
                                            <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                        </div>

                                        <div className="datatables">
                                            <DataTable
                                                striped
                                                className="whitespace-nowrap table-striped"
                                                records={recordsData}
                                                columns={[
                                                    { accessor: 'name', title: 'Provider' },
                                                    { accessor: 'desc', title: 'Description' },
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
                                                        width: '200px',
                                                        textAlignment: 'center',
                                                        render: (item) => {
                                                            return (
                                                                <>
                                                                    <div className="flex justify-around">
                                                                        <button type="button" onClick={() => openEditModal(item)} className="btn btn-warning">
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
                                                                        <button type="button" onClick={() => setModalDelete(true)} className="btn btn-danger">
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
                                                totalRecords={initialRecords.length}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={(p) => setPage(p)}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                minHeight={200}
                                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* modal zone */}

                        {/* edit */}
                        <Transition appear show={modal1} as={Fragment}>
                            <Dialog as="div" open={modal1} onClose={() => setModal1(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-xl text-black dark:text-white-dark">
                                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                    <div className="text-lg font-bold">Edit Provider</div>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModal1(false)}>
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
                                                            <label htmlFor="">Provider</label>
                                                            <input
                                                                name="name"
                                                                type="text"
                                                                placeholder=""
                                                                value={dataForEditProvider.name}
                                                                onChange={handleChangeProvider}
                                                                className="w-96 ml-5 form-input text-base"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label htmlFor="">Description</label>
                                                            <textarea
                                                                value={dataForEditProvider.desc}
                                                                onChange={handleChangeProvider}
                                                                name="desc"
                                                                placeholder=""
                                                                className="w-96 ml-5 form-input text-base"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="relative border-2 p-5 mt-5 form-input">
                                                            <div className="absolute top-[-10px] left-2 bg-white px-1">Credential</div>
                                                            <div className="flex items-center justify-end my-4">
                                                                <label htmlFor="">Username</label>
                                                                <input
                                                                    name="credential:username"
                                                                    value={dataForEditProvider.credential.username}
                                                                    onChange={handleChangeProvider}
                                                                    type="text"
                                                                    placeholder=""
                                                                    className="w-96 ml-5 form-input text-base"
                                                                    required
                                                                />
                                                            </div>

                                                            <div className="flex items-start justify-end my-4">
                                                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                                    Password
                                                                </label>
                                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                                    <input
                                                                        name="credential:password"
                                                                        value={dataForEditProvider.credential.password}
                                                                        onChange={handleChangeProvider}
                                                                        type={passwordShown ? 'text' : 'password'}
                                                                        required
                                                                        className="w-96 ml-5 form-input text-base"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={togglePasswordVisibility}
                                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                                                    >
                                                                        {passwordShown ? (
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    clip-rule="evenodd"
                                                                                    d="M15.9202 12.7988C15.9725 12.5407 16 12.2736 16 12C16 9.79086 14.2091 8 12 8C11.7264 8 11.4593 8.02746 11.2012 8.07977L15.9202 12.7988ZM8.66676 9.78799C8.24547 10.4216 8 11.1821 8 12C8 14.2091 9.79086 16 12 16C12.8179 16 13.5784 15.7545 14.212 15.3332L12.7381 13.8594C12.5098 13.9501 12.2607 14 12 14C10.8954 14 10 13.1046 10 12C10 11.7393 10.0499 11.4902 10.1406 11.2619L8.66676 9.78799Z"
                                                                                    fill="#FF0000"
                                                                                />
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    clip-rule="evenodd"
                                                                                    d="M16.5189 17.6405L15.0496 16.1712C14.0774 16.6805 13.0475 17 11.9998 17C10.474 17 8.98592 16.3224 7.6589 15.3677C6.33978 14.4186 5.26384 13.2558 4.58362 12.43C4.48385 12.3088 4.40934 12.2182 4.34761 12.1385C4.29874 12.0754 4.26762 12.0315 4.24731 12C4.26762 11.9685 4.29874 11.9246 4.34761 11.8615C4.40934 11.7818 4.48385 11.6912 4.58362 11.57C5.24903 10.7622 6.2931 9.63187 7.57307 8.69463L6.14434 7.2659C4.79618 8.29616 3.72222 9.47005 3.03985 10.2985C3.01626 10.3272 2.99168 10.3566 2.96638 10.3869L2.96636 10.3869C2.65294 10.7624 2.22949 11.2696 2.22949 12C2.22949 12.7304 2.65294 13.2376 2.96636 13.6131L2.96658 13.6133C2.99181 13.6435 3.01633 13.6729 3.03985 13.7015C3.77972 14.5998 4.97993 15.9041 6.49087 16.9912C7.99391 18.0725 9.88983 19 11.9998 19C13.6698 19 15.2057 18.419 16.5189 17.6405ZM8.80658 5.6855C9.79037 5.26871 10.8641 5 11.9998 5C14.1097 5 16.0056 5.92747 17.5087 7.00885C19.0196 8.0959 20.2198 9.40025 20.9597 10.2985C20.9833 10.3272 21.0078 10.3566 21.0331 10.3869L21.0332 10.3869C21.3466 10.7624 21.77 11.2696 21.77 12C21.77 12.7304 21.3466 13.2376 21.0332 13.6131C21.0079 13.6434 20.9833 13.6728 20.9597 13.7015C20.473 14.2923 19.7872 15.0589 18.9448 15.8237L17.5287 14.4077C18.3086 13.708 18.9536 12.9912 19.4159 12.43C19.5157 12.3088 19.5902 12.2182 19.6519 12.1385C19.7008 12.0754 19.7319 12.0315 19.7522 12C19.7319 11.9685 19.7008 11.9246 19.6519 11.8615C19.5902 11.7818 19.5157 11.6912 19.4159 11.57C18.7357 10.7442 17.6598 9.58138 16.3406 8.63233C15.0136 7.6776 13.5256 7 11.9998 7C11.4488 7 10.9027 7.08837 10.3673 7.24624L8.80658 5.6855Z"
                                                                                    fill="#FF0000"
                                                                                />
                                                                                <path d="M5 2L21 18" stroke="#FF0000" stroke-width="2" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    d="M11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678Z"
                                                                                    stroke="#848080"
                                                                                    stroke-width="2"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                />
                                                                                <path
                                                                                    d="M2.04785 10.0001C3.10952 6.61925 6.26868 4.16675 9.99952 4.16675C13.7312 4.16675 16.8895 6.61925 17.9512 10.0001C16.8895 13.3809 13.7312 15.8334 9.99952 15.8334C6.26868 15.8334 3.10952 13.3809 2.04785 10.0001Z"
                                                                                    stroke="#848080"
                                                                                    stroke-width="2"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                </div>
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
                                                                        checked={statusToggleProvider}
                                                                        onChange={() => setStatusToggleProvider(!statusToggleProvider)}
                                                                    />
                                                                    <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                                </label>
                                                                {statusToggleProvider ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </form>

                                                    <div className="flex justify-end items-center mt-8">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModal1(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModal1(false)}>
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
                        <Transition appear show={modalAdd} as={Fragment}>
                            <Dialog as="div" open={modalAdd} onClose={() => setModalAdd(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-xl text-black dark:text-white-dark">
                                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                    <div className="text-lg font-bold">Add Provider</div>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAdd(false)}>
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
                                                            <label htmlFor="">Provider</label>
                                                            <input type="text" placeholder="" className="w-96 ml-5 form-input text-base" required />
                                                        </div>
                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label htmlFor="">Description</label>
                                                            <textarea placeholder="" className="w-96 ml-5 form-input text-base" required />
                                                        </div>

                                                        <div className="relative border-2 p-5 mt-5 form-input">
                                                            <div className="absolute top-[-10px] left-2 bg-white px-1">Credential</div>
                                                            <div className="flex items-center justify-end my-4">
                                                                <label className="text-base text-gray-700" htmlFor="">
                                                                    Username
                                                                </label>
                                                                <input type="text" placeholder="" className="w-96 ml-5 form-input text-base" required />
                                                            </div>

                                                            <div className="flex items-center justify-end my-4">
                                                                <label htmlFor="password" className="text-base text-gray-700">
                                                                    Password
                                                                </label>
                                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                                    <input type={passwordShown ? 'text' : 'password'} required className="w-96 ml-5 form-input text-base" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={togglePasswordVisibility}
                                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                                                    >
                                                                        {passwordShown ? (
                                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    clip-rule="evenodd"
                                                                                    d="M15.9202 12.7988C15.9725 12.5407 16 12.2736 16 12C16 9.79086 14.2091 8 12 8C11.7264 8 11.4593 8.02746 11.2012 8.07977L15.9202 12.7988ZM8.66676 9.78799C8.24547 10.4216 8 11.1821 8 12C8 14.2091 9.79086 16 12 16C12.8179 16 13.5784 15.7545 14.212 15.3332L12.7381 13.8594C12.5098 13.9501 12.2607 14 12 14C10.8954 14 10 13.1046 10 12C10 11.7393 10.0499 11.4902 10.1406 11.2619L8.66676 9.78799Z"
                                                                                    fill="#FF0000"
                                                                                />
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    clip-rule="evenodd"
                                                                                    d="M16.5189 17.6405L15.0496 16.1712C14.0774 16.6805 13.0475 17 11.9998 17C10.474 17 8.98592 16.3224 7.6589 15.3677C6.33978 14.4186 5.26384 13.2558 4.58362 12.43C4.48385 12.3088 4.40934 12.2182 4.34761 12.1385C4.29874 12.0754 4.26762 12.0315 4.24731 12C4.26762 11.9685 4.29874 11.9246 4.34761 11.8615C4.40934 11.7818 4.48385 11.6912 4.58362 11.57C5.24903 10.7622 6.2931 9.63187 7.57307 8.69463L6.14434 7.2659C4.79618 8.29616 3.72222 9.47005 3.03985 10.2985C3.01626 10.3272 2.99168 10.3566 2.96638 10.3869L2.96636 10.3869C2.65294 10.7624 2.22949 11.2696 2.22949 12C2.22949 12.7304 2.65294 13.2376 2.96636 13.6131L2.96658 13.6133C2.99181 13.6435 3.01633 13.6729 3.03985 13.7015C3.77972 14.5998 4.97993 15.9041 6.49087 16.9912C7.99391 18.0725 9.88983 19 11.9998 19C13.6698 19 15.2057 18.419 16.5189 17.6405ZM8.80658 5.6855C9.79037 5.26871 10.8641 5 11.9998 5C14.1097 5 16.0056 5.92747 17.5087 7.00885C19.0196 8.0959 20.2198 9.40025 20.9597 10.2985C20.9833 10.3272 21.0078 10.3566 21.0331 10.3869L21.0332 10.3869C21.3466 10.7624 21.77 11.2696 21.77 12C21.77 12.7304 21.3466 13.2376 21.0332 13.6131C21.0079 13.6434 20.9833 13.6728 20.9597 13.7015C20.473 14.2923 19.7872 15.0589 18.9448 15.8237L17.5287 14.4077C18.3086 13.708 18.9536 12.9912 19.4159 12.43C19.5157 12.3088 19.5902 12.2182 19.6519 12.1385C19.7008 12.0754 19.7319 12.0315 19.7522 12C19.7319 11.9685 19.7008 11.9246 19.6519 11.8615C19.5902 11.7818 19.5157 11.6912 19.4159 11.57C18.7357 10.7442 17.6598 9.58138 16.3406 8.63233C15.0136 7.6776 13.5256 7 11.9998 7C11.4488 7 10.9027 7.08837 10.3673 7.24624L8.80658 5.6855Z"
                                                                                    fill="#FF0000"
                                                                                />
                                                                                <path d="M5 2L21 18" stroke="#FF0000" stroke-width="2" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path
                                                                                    d="M11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678Z"
                                                                                    stroke="#848080"
                                                                                    stroke-width="2"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                />
                                                                                <path
                                                                                    d="M2.04785 10.0001C3.10952 6.61925 6.26868 4.16675 9.99952 4.16675C13.7312 4.16675 16.8895 6.61925 17.9512 10.0001C16.8895 13.3809 13.7312 15.8334 9.99952 15.8334C6.26868 15.8334 3.10952 13.3809 2.04785 10.0001Z"
                                                                                    stroke="#848080"
                                                                                    stroke-width="2"
                                                                                    stroke-linecap="round"
                                                                                    stroke-linejoin="round"
                                                                                />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                </div>
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
                                                                        checked={statusToggleProvider}
                                                                        onClick={() => setStatusToggleProvider(!statusToggleProvider)}
                                                                    />
                                                                    <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                                </label>
                                                                {statusToggleProvider ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </form>

                                                    <div className="flex justify-end items-center mt-8">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModalAdd(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModalAdd(false)}>
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
                        <Transition appear show={modalDelete} as={Fragment}>
                            <Dialog as="div" open={modalDelete} onClose={() => setModalDelete(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalDelete(false)}>
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
                                                    <span>Are you sure to delete provider ?</span>
                                                    <span>If you delete this provider you can’t recover it.</span>
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
                    </Tab.Panel>

                    {/* Channel content */}
                    <Tab.Panel>
                        <div className="active pt-5">
                            <div className="grid xl:grid-cols-3 gap-6 mb-6">
                                <div className="panel h-full xl:col-span-3">
                                    <div className="panel">
                                        <div className="flex items-center justify-end mb-5">
                                            <h5 className="mr-3 font-semibold text-lg dark:text-white-light">
                                                <button
                                                    onClick={() => {
                                                        openAddModalChannel();
                                                    }}
                                                    type="button"
                                                    className="btn btn-primary"
                                                >
                                                    Add
                                                </button>
                                            </h5>
                                            <div className=" mr-3">
                                                <select id="filter" className="form-input w-auto select form">
                                                    <option selected>Filter</option>
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="FR">France</option>
                                                    <option value="DE">Germany</option>
                                                </select>
                                            </div>
                                            <input type="text" className="form-input w-auto" placeholder="Search..." value={searchChannel} onChange={(e) => setSearchChannel(e.target.value)} />
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
                                                totalRecords={initialRecords.length}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={(p) => setPage(p)}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                minHeight={200}
                                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
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
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                                {statusToggleChannel ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
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
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                                {statusToggleChannel ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
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
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalDelete(false)}>
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
                    </Tab.Panel>

                    {/* Type content */}
                    <Tab.Panel>
                        <div className="active pt-5">
                            <div className="grid xl:grid-cols-3 gap-6 mb-6">
                                <div className="panel h-full xl:col-span-3">
                                    <div className="panel">
                                        <div className="flex items-center justify-end mb-5">
                                            <h5 className="mr-3 font-semibold text-lg dark:text-white-light">
                                                <button
                                                    onClick={() => {
                                                        openAddModalType();
                                                    }}
                                                    type="button"
                                                    className="btn btn-primary"
                                                >
                                                    Add
                                                </button>
                                            </h5>
                                            <div className=" mr-3">
                                                <select id="filter" className="form-input w-auto select form">
                                                    <option selected>Filter</option>
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="FR">France</option>
                                                    <option value="DE">Germany</option>
                                                </select>
                                            </div>
                                            <input type="text" className="form-input w-auto" placeholder="Search..." value={searchType} onChange={(e) => setSearchType(e.target.value)} />
                                        </div>

                                        <div className="datatables">
                                            <DataTable
                                                striped
                                                className="whitespace-nowrap table-striped"
                                                records={recordsDataType}
                                                columns={[
                                                    { accessor: 'name', title: 'Type' },
                                                    { accessor: 'desc', title: 'Description' },
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
                                                                        <button type="button" onClick={() => openEditModalType(item)} className="btn btn-warning">
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
                                                                        <button type="button" onClick={() => setModalDeleteType(true)} className="btn btn-danger">
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
                                                totalRecords={initialRecords.length}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={(p) => setPage(p)}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                minHeight={200}
                                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* modal zone */}

                        {/* edit */}
                        <Transition appear show={modalEditType} as={Fragment}>
                            <Dialog as="div" open={modalEditType} onClose={() => setModalEditType(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                    <div className="text-lg font-bold">Edit Type</div>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAddType(false)}>
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
                                                            <label htmlFor="">Type</label>
                                                            <input
                                                                value={dataForEditType.name}
                                                                onChange={handleChangeType}
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
                                                                value={dataForEditType.desc}
                                                                onChange={handleChangeType}
                                                                name="desc"
                                                                placeholder=""
                                                                className="w-96 ml-5 form-input text-base"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="flex items-start justify-end my-4 mr-5 overflow-visible">
                                                            <label htmlFor="">Channel</label>
                                                            <div className="w-96 ml-5 text-base">
                                                                <Select defaultValue={channelSelected[0]} options={channelSelected} isSearchable={false} />
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
                                                                        checked={statusToggleType}
                                                                        onChange={() => setStatusToggleType(!statusToggleType)}
                                                                    />
                                                                    <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                                </label>
                                                                {statusToggleType ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </form>

                                                    <div className="flex justify-end items-center mt-8">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModalAddType(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModalAddType(false)}>
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
                        <Transition appear show={modalAddType} as={Fragment}>
                            <Dialog as="div" open={modalAddType} onClose={() => setModalAddType(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                    <div className="text-lg font-bold">Add Type</div>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAddType(false)}>
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
                                                            <label htmlFor="">Channel</label>
                                                            <div className="w-96 ml-5 text-base">
                                                                <Select defaultValue={channelSelected[0]} options={channelSelected} isSearchable={false} />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label htmlFor="">Status</label>
                                                            <div className="w-96 ml-5 flex items-center">
                                                                <label className="w-12 h-6 relative">
                                                                    <input
                                                                        type="checkbox
                                                                        "
                                                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                        id="custom_switch_checkbox1"
                                                                        checked={statusToggleChannel}
                                                                        onChange={() => setStatusToggleChannel(!statusToggleChannel)}
                                                                    />
                                                                    <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                                </label>
                                                                {statusToggleChannel ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <div className="flex justify-end items-center mt-8">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModalAddType(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModalAddType(false)}>
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

                        {/* delect */}
                        <Transition appear show={modalDeleteType} as={Fragment}>
                            <Dialog as="div" open={modalDeleteType} onClose={() => setModalDeleteType(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalDeleteType(false)}>
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
                                                    <span>Are you sure to delete type ?</span>
                                                    <span>If you delete this type you can’t recover it.</span>
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
                    </Tab.Panel>

                    {/* Template content */}
                    <Tab.Panel>
                        <div className="active pt-5">
                            <div className="grid xl:grid-cols-3 gap-6 mb-6">
                                <div className="panel h-full xl:col-span-3">
                                    <div className="panel">
                                        <div className="flex items-center justify-end mb-5">
                                            <h5 className="mr-3 font-semibold text-lg dark:text-white-light">
                                                <button
                                                    onClick={() => {
                                                        openAddModalTemplate();
                                                    }}
                                                    type="button"
                                                    className="btn btn-primary"
                                                >
                                                    Add
                                                </button>
                                            </h5>
                                            <div className=" mr-3">
                                                <select id="filter" className="form-input w-auto select form">
                                                    <option selected>Filter</option>
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="FR">France</option>
                                                    <option value="DE">Germany</option>
                                                </select>
                                            </div>
                                            <input type="text" className="form-input w-auto" placeholder="Search..." value={searchTemplate} onChange={(e) => setSearchTemplate(e.target.value)} />
                                        </div>

                                        <div className="datatables">
                                            <DataTable
                                                striped
                                                className="whitespace-nowrap table-striped"
                                                records={recordsDataTemplate}
                                                columns={[
                                                    { accessor: 'name', title: 'Provider' },
                                                    { accessor: 'desc', title: 'Description' },
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
                                                                        <button type="button" onClick={() => openEditModalTemplate(item)} className="btn btn-warning">
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
                                                                        <button type="button" onClick={() => setModalDeleteTemplate(true)} className="btn btn-danger">
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
                                                totalRecords={initialRecords.length}
                                                recordsPerPage={pageSize}
                                                page={page}
                                                onPageChange={(p) => setPage(p)}
                                                recordsPerPageOptions={PAGE_SIZES}
                                                onRecordsPerPageChange={setPageSize}
                                                minHeight={200}
                                                paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* modal zone */}

                        {/* edit */}
                        <Transition appear show={modalEditTemplate} as={Fragment}>
                            <Dialog as="div" open={modalEditTemplate} onClose={() => setModalEditTemplate(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-visible my-8 w-full max-w-2xl text-black dark:text-white-dark">
                                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                    <div className="text-lg font-bold">Edit Template</div>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalEditTemplate(false)}>
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
                                                            <label htmlFor="">Template</label>
                                                            <input
                                                                value={dataForEditTemplate.name}
                                                                onChange={handleChangeTemplate}
                                                                name="name"
                                                                type="text"
                                                                placeholder=""
                                                                className="w-3/4 ml-5 form-input text-base"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label htmlFor="">Description</label>
                                                            <textarea
                                                                value={dataForEditTemplate.desc}
                                                                onChange={handleChangeTemplate}
                                                                name="desc"
                                                                placeholder=""
                                                                className="w-3/4 ml-5 form-input text-base"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="flex items-start justify-end my-4 mr-5 overflow-visible">
                                                            <label htmlFor="">Type</label>
                                                            <div className="w-3/4 ml-5 text-base">
                                                                <Select defaultValue={typeSelected[0]} options={typeSelected} isSearchable={false} />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-end my-4 mr-5">
                                                            <label className="ml-5 text-base pt-4" htmlFor="">
                                                                Subject
                                                            </label>
                                                            <input
                                                                value={dataForEditTemplate.content.subject}
                                                                onChange={handleChangeTemplate}
                                                                name="content.subject" 
                                                             type="text" placeholder="" className="w-3/4 ml-5 form-input text-base" required />
                                                        </div>

                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label className="ml-5 text-base pt-4" htmlFor="">
                                                                Body
                                                            </label>
                                                            <div className="w-3/4 ml-5 text-base">
                                                                <ReactQuill theme="snow" value={
                                                                    dataForEditTemplate.content.body
                                                                } onChange={setTemplateValue} />
                                                            </div>{' '}
                                                        </div>
                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label htmlFor="">Status</label>
                                                            <div className="w-3/4 ml-5 flex items-center">
                                                                <label className="w-12 h-6 relative">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"
                                                                        id="custom_switch_checkbox1"
                                                                        checked={statusToggleTemplate}
                                                                        onChange={() => setStatusToggleTemplate(!statusToggleTemplate)}
                                                                    />
                                                                    <span className="outline_checkbox bg-icon border-2 border-[#ebedf2] dark:border-white-dark block h-full rounded-full before:absolute before:left-1 before:bg-[#ebedf2] dark:before:bg-white-dark before:bottom-1 before:w-4 before:h-4 before:rounded-full before:bg-[url(/assets/images/close.svg)] before:bg-no-repeat before:bg-center peer-checked:before:left-7 peer-checked:before:bg-[url(/assets/images/checked.svg)] peer-checked:border-success peer-checked:before:bg-success before:transition-all before:duration-300"></span>
                                                                </label>
                                                                {statusToggleTemplate ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <div className="flex justify-end items-center mt-8">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModalEditTemplate(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModalEditTemplate(false)}>
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
                        <Transition appear show={modalAddTemplate} as={Fragment}>
                            <Dialog as="div" open={modalAddTemplate} onClose={() => setModalAddTemplate(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                            <Dialog.Panel as="div" className="panel border-0 p-0 rounded-lg overflow-visible my-8 w-full max-w-2xl text-black dark:text-white-dark">
                                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                                    <div className="text-lg font-bold">Add Template</div>
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalAddTemplate(false)}>
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
                                                            <label htmlFor="">Template</label>
                                                            <input type="text" placeholder="" className="w-3/4 ml-5 form-input text-base" required />
                                                        </div>
                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label htmlFor="">Description</label>
                                                            <textarea placeholder="" className="w-3/4 ml-5 form-input text-base" required />
                                                        </div>

                                                        <div className="flex items-start justify-end my-4 mr-5 overflow-visible">
                                                            <label htmlFor="">Type</label>
                                                            <div className="w-3/4 ml-5 text-base">
                                                                <Select defaultValue={channelSelected[0]} options={channelSelected} isSearchable={false} />
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-end my-4 mr-5">
                                                            <label className="ml-5 text-base pt-4" htmlFor="">
                                                                Subject
                                                            </label>
                                                            <input type="text" placeholder="" className="w-3/4 ml-5 form-input text-base" required />
                                                        </div>

                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label className="ml-5 text-base pt-4" htmlFor="">
                                                                Body
                                                            </label>
                                                            <div className="w-3/4 ml-5 text-base">
                                                                <ReactQuill theme="snow" value={templateValue} onChange={setTemplateValue} />
                                                            </div>{' '}
                                                        </div>

                                                        <div className="flex items-start justify-end my-4 mr-5">
                                                            <label htmlFor="">Status</label>
                                                            <div className="w-3/4 ml-5 flex items-center">
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
                                                                {statusToggleChannel ? (
                                                                    <span className="text-sm text-success px-5">Active</span>
                                                                ) : (
                                                                    <span className="text-sm text-danger px-5">Inactive</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <div className="flex justify-end items-center mt-8">
                                                        <button type="button" className="btn btn-outline-danger" onClick={() => setModalAddTemplate(false)}>
                                                            Cancel
                                                        </button>
                                                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => setModalAddTemplate(false)}>
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

                        {/* delect */}
                        <Transition appear show={modalDeleteTemplate} as={Fragment}>
                            <Dialog as="div" open={modalDeleteTemplate} onClose={() => setModalDeleteTemplate(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
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
                                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setModalDeleteTemplate(false)}>
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
                                                    <span>Are you sure to delete template ?</span>
                                                    <span>If you delete this template you can’t recover it.</span>
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
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default msgSetting;
