export default function ThumbnailUploader({
  files,
  thumbnailIndex,
  setThumbnailIndex,
  handleFileChange,
  handleDelete,
}) {
  return (
    <>
      <div className="thumbnail-row">
        <label>대표 이미지</label>

        <button
          className="button-thumbnail"
          onClick={() =>
            document
              .getElementById("fileInput")
              .click()
          }
        >
          파일 선택
        </button>
      </div>

      <input
        type="file"
        id="fileInput"
        multiple
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="preview-grid">
        {files.map((item, index) => (
          <div
            key={item.id}
            className={`preview-item ${
              thumbnailIndex === index
                ? "active"
                : ""
            }`}
            onClick={() =>
              setThumbnailIndex(index)
            }
          >
            <img src={item.preview} alt="" />

            <button
              className="delete-btn"
              onClick={(e) =>
                handleDelete(index, e)
              }
            >
              ✕
            </button>

            {thumbnailIndex === index && (
              <div className="badge">
                대표
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}