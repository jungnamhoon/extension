/* state of upload for progress */
export const uploadState = { uploading: false };
export const baseUrl = 'https://api.skyisthelimit.cloud';
// export const baseUrl = 'http://localhost:8080';

/* 채점 결과에 대한 각 구분 정보 */
export const RESULT_CATEGORY = {
    RESULT_ACCEPTED : 'ac', // 맞았습니다
    RESULT_PRESENTATION_ERROR : 'pe', // 출력 형식 에러
    RESULT_WRONG_ANSWER : 'wa', // 틀렸습니다
    RESULT_TIME_LIMIT_EXCEEDED : 'tle', // 시간 초과
    RESULT_MEMORY_LIMIT_EXCEEDED : 'mle', // 메모리 초과
    RESULT_RUNTIME_ERROR : 'rte', // 런타임 에러
    RESULT_COMPILATION_ERROR : 'ce', // 컴파일 에러
};