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
import { em } from '@fullcalendar/core/internal-common';
import MsgProvider from '../components/msgSystem/provider';
import MsgChannel from '../components/msgSystem/channel';
import MsgType from '../components/msgSystem/type';
import MsgTemplate from '../components/msgSystem/template';

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

    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [filter, setFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(rowData);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [search, setSearch] = useState('');

    return (
        <div>
            <h1 className="font-bold text-xl">
                System Setting / Message{' '}
                {currentTabName === 'Provider' ? 'Provider' : currentTabName === 'Channel' ? 'Channel' : currentTabName === 'Type' ? 'Type' : currentTabName === 'Template' ? 'Template' : ''}
            </h1>
            <Tab.Group>
                <Tab.List className="mt-3 flex w-full ">
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Provider')}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Provider
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Channel')}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Channel
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Type')}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Type
                            </button>
                        )}
                    </Tab>
                    <Tab as={Fragment}>
                        {({ selected }) => (
                            <button
                                onClick={() => setCurrentTabName('Template')}
                                className={`${
                                    selected ? 'border-b !border-primary text-primary !outline-none' : ''
                                } -mb-[1px] font-bold flex items-center border-transparent p-5 py-3 before:inline-block hover:border-b hover:!border-primary hover:text-primary`}
                            >
                                Template
                            </button>
                        )}
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    {/* Provider content */}
                    <Tab.Panel>
                        <MsgProvider />
                    </Tab.Panel>

                    {/* Channel content */}
                    <Tab.Panel>
                        <MsgChannel />
                    </Tab.Panel>

                    {/* Type content */}
                    <Tab.Panel>
                        <MsgType />
                    </Tab.Panel>

                    {/* Template content */}
                    <Tab.Panel>
                        <MsgTemplate />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default msgSetting;
