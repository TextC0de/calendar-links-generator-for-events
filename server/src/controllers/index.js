const upload = async ({ file }, res) => {
    res.status(200).send(file.filename);
};

export default {
    upload
};
