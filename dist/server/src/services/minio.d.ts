declare const minio: () => {
    get({ settings, objectName }: {
        settings: any;
        objectName: any;
    }): Promise<string>;
};
export default minio;
