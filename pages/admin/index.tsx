import React, { useContext, useState } from 'react';
import classes from '../../styles/components/Admin/AdminPage.module.css';
// Context
import { GlobalContext } from '../../context/GlobalContext';
// Components
import AdminLayout from '../../components/LayoutComponents/AdminLayout';
import Main from '../../components/LayoutComponents/Main';
import Modal from '../../components/Modal';
import { Icon } from '@iconify/react';
import Link from 'next/link';
// GraphQL
import { getCategories, getMetadata } from '../../ApolloClient/querys';
import { addApolloState, initializeApollo } from '../../ApolloClient/NewApolloConfig';
// Types
import { ApolloError } from '@apollo/client';
import { CategoryType, MetadataType, ModalActions } from '../../types/Types';

type Props = {
    categories: CategoryType[]
    metadata: MetadataType[]
    error: ApolloError[]
}

export default function AdminPage({ categories, metadata }: Props) {
    const { user, setModalInfo } = useContext(GlobalContext);
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>();
    const [selectedMetadata, setSelectedMetadata] = useState<MetadataType>();

    if (user === null && typeof window !== 'undefined') window.location.assign('/');

    const handleModalOpen = (action: ModalActions, title: string) => {
        scroll({ top: 0, behavior: 'smooth' });
        setModalInfo({
            open: true,
            action,
            title
        });
    };

    const handleRowSelected = (row: CategoryType | MetadataType, type: 'C' | 'M') => {
        if (type === 'C') {
            if (row.id === selectedCategory?.id) return setSelectedCategory(undefined);
            return setSelectedCategory(row as CategoryType);
        };
        if (type === 'M') {
            if (row.id === selectedMetadata?.id) return setSelectedMetadata(undefined);
            return setSelectedMetadata(row as MetadataType);
        };
    };

    return (
        <AdminLayout title="Admin - ">
            <Main>
                <Modal category={selectedCategory} metadata={selectedMetadata} setSelectedCategory={setSelectedCategory} setSelectedMetadata={setSelectedMetadata} />
                <h1 className={classes.title}>Admin page</h1>
                <section className={classes.section}>
                    <h4 className={classes.subtitle}>Article management</h4>
                    <div className={classes.links}>
                        <button className={classes.button}>
                            <Link href="/admin/article-list">Posted article's list</Link>
                        </button>
                        <button className={classes.button}>
                            <Link href="/admin/article-queue">Article queue</Link>
                        </button>
                        <button className={classes.button}>
                            <Link href="/admin/new-article">Create new article</Link>
                        </button>
                    </div>
                </section>
                <section className={classes.section}>
                    <h4 className={classes.subtitle}>List of categories</h4>
                    <div className={classes.tableContainer}>
                        <div className={classes.table} data-testid="admin-page__categoriesTable">
                            {categories.map(category => (
                                <div key={category.id}
                                    className={selectedCategory?.id === category.id ? classes.rowSelected : classes.row}
                                    onClick={() => handleRowSelected(category, 'C')}
                                >
                                    {category.name}
                                </div>
                            ))}
                        </div>
                        <div className={classes.buttons} data-testid="admin-page__categoriesButtons">
                            {selectedCategory ?
                                <>
                                    <Icon
                                        icon="bx:bxs-message-square-edit"
                                        fontSize={40}
                                        onClick={() => handleModalOpen(ModalActions.EDIT_CATEGORY, 'Edit a category')}
                                    />
                                    <Icon
                                        icon="bx:bxs-trash"
                                        fontSize={40}
                                        onClick={() => handleModalOpen(ModalActions.DELETE_CATEGORY, 'Delete a category')}
                                    />
                                </>
                                :
                                <Icon
                                    icon="bx:bxs-message-rounded-add"
                                    fontSize={40}
                                    onClick={() => handleModalOpen(ModalActions.ADD_CATEGORY, 'Add a category')}
                                />
                            }
                        </div>
                    </div>
                </section>
                <section className={classes.section}>
                    <h4 className={classes.subtitle}>Metadata</h4>
                    <div className={classes.tableContainer}>
                        <div className={classes.table} data-testid="admin-page__metadataTable">
                            {metadata.map(metadata => (
                                <div key={metadata.id}
                                    className={selectedMetadata?.id === metadata.id ? classes.rowSelected : classes.row}
                                    onClick={() => handleRowSelected(metadata, 'M')}
                                >
                                    {metadata.name}
                                </div>
                            ))}
                        </div>
                        <div className={classes.buttons} data-testid="admin-page__metadataButtons">
                            {selectedMetadata &&
                                <Icon
                                    icon="bx:bxs-message-square-edit"
                                    fontSize={40}
                                    onClick={() => handleModalOpen(ModalActions.EDIT_METADATA, 'Edit metadata')}
                                />
                            }
                        </div>
                    </div>
                </section>
            </Main>
        </AdminLayout>
    )
};

export async function getStaticProps() {
    const client = initializeApollo();
    try {
        const categories = await getCategories(client);
        const metadata = await getMetadata(client);

        return addApolloState(client, {
            props: {
                categories: categories.data.getCategories,
                metadata: metadata.data.getMetadata
            }
        })
    }
    catch (err) {
        console.log(err);
        return addApolloState(client, {
            props: {
                categories: [],
                metadata: [],
                error: JSON.parse(JSON.stringify(err))
            }
        });
    }
};