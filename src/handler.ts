import { S3 } from "aws-sdk"

const bucketName = process.env.BUCKET!

const signedUrlExpireSeconds = 604800

function createSignedUrl(path: string) {
    const st = new S3()
    return st.getSignedUrlPromise("getObject", {
        Bucket: bucketName,
        Key: path,
        Expires: signedUrlExpireSeconds,
    })
}

// From https://docs.aws.amazon.com/cdk/latest/guide/serverless_example.html
const handler = async function (event: any, context: any) {
    const S3Client = new S3()

    try {
        var method = event.httpMethod

        const path: string = event.path.substring(1)

        if (method === "GET") {
            const url = await createSignedUrl(path)

            return {
                statusCode: 301,
                headers: {
                    Location: url,
                },
            }
        }

        return {
            statusCode: 400,
            body: event,
        }
    } catch (error) {
        const body = error.stack || JSON.stringify(error, null, 2)
        return {
            statusCode: 400,
            headers: {},
            body: JSON.stringify(body),
        }
    }
}

export { handler }
