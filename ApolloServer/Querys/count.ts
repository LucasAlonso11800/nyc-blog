import executeQuery from "../../dbConfig";
// Types 
import { CountType } from "../../types/Types";

type Args = {
    categoryId: string | number,
    search: string  
}

export const getTotalArticleCount = async () => {
    const query: string = 'SELECT COUNT(*) as count FROM articles';
    const count: CountType[] = await executeQuery(query, []);
    return count[0].count;
};

export const getCategoryArticleCount = async (_: any, args: Args) => {
    const { categoryId } = args;
    const query: string = 'SELECT COUNT(*) as count FROM articles WHERE article_category_id = ?';
    const values: [number] = [typeof categoryId === 'number' ? categoryId : parseInt(categoryId)];
    const count: CountType[] = await executeQuery(query, values);
    return count[0].count;
};

export const getSearchedArticleCount = async (_: any, args: Args) => {
    const { search } = args;
    const query: string = 'SELECT COUNT(*) as count FROM articles WHERE article_title LIKE CONCAT("%", ?, "%")';
    const values: [string] = [search];
    const count: CountType[] = await executeQuery(query, values);
    return count[0].count;
};