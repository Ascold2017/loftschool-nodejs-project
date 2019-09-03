const News = require('../../db/models/news');
const User = require('../../db/models/user');
const newsSerializer = (news, user) => ({
    id: news._id,
    created_at: news.date,
    text: news.text,
    title: news.title,
    user: {
        firstName: user.firstName || '',
        id: user._id,
        image: user.image || '',
        middleName: user.middleName || '',
        surName: user.surName || '',
        username: user.username
    }
})
const getNews = exports.getNews = () => new Promise(async (resolve, reject) => {
    try {
        // возвращаем все новости всех юзеров
        allNews = await News.find();
        allUsers = await User.find();

        const resolvedResult = allNews.map((news) => {
            let user = allUsers.find((u) => u._id.toString() === news.userId);
            // если юзера нету, то новость все равно выводим
            if (!user) {
                user = {
                    firstName: 'Undefined',
                    id: null,
                    image: '',
                    middleName: 'Undefined',
                    surName: 'Undefined',
                    username: 'Undefined'
                }
            }
            return newsSerializer(news, user)
        });

        resolve(resolvedResult);
    }
    catch (err) {
        reject(err);
    }
});

exports.newNews = ({text, title, user}) => new Promise(async (resolve, reject) => {
    try {

        // затем просто сохраняем новость и указываем какого она пользователя
        const newNews = new News({
            date: new Date(),
            text,
            title,
            userId: user.id
        });
        await newNews.save();

        // возвращаем все новости всех юзеров
        const resolvedResult = await getNews();

        resolve(resolvedResult);

    }
    catch (err) {
        reject(err);
    }
});

exports.updateNews = ({user, id, text, title}) => new Promise(async (resolve, reject) => {
    try {

        // потом определить существует ли такая новость
        const existedNews = await News.findById(id);
        if (!existedNews) {
            resolve({
                success: false,
                message: 'News are not existed'
            });
            return;
        }

        // обновляем значения новости
        existedNews.set({ text, title });
        await existedNews.save();

        // возвращаем все новости всех юзеров
        const resolvedResult = await getNews();

        resolve(resolvedResult);
    }
    catch (err) {
        reject(err);
    }
});

exports.deleteNews = ({id}) => new Promise(async (resolve, reject) => {
    try {
        // удаляем новость
        await News.findByIdAndRemove(id);

        // возвращаем все новости всех юзеров
        const resolvedResult = await getNews();

        resolve(resolvedResult);
    }
    catch (err) {
        reject(err);
    }
});


