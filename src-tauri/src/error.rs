use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum AppError {
    #[serde(serialize_with = "serialize_error")]
    IoError(std::io::Error),
    #[serde(serialize_with = "serialize_error")]
    DbError(rusqlite::Error),
    #[serde(serialize_with = "serialize_error")]
    SerdeError(serde_json::error::Error),
    Custom(String),
}

fn serialize_error<S>(err: &dyn std::fmt::Display, serializer: S) -> std::result::Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    serializer.serialize_str(&err.to_string())
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AppError::IoError(e) => write!(f, "IO error: {}", e),
            AppError::DbError(e) => write!(f, "Database error: {}", e),
            AppError::SerdeError(e) => write!(f, "Serialization error: {}", e),
            AppError::Custom(msg) => write!(f, "{}", msg),
        }
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::IoError(err)
    }
}

impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::DbError(err)
    }
}

impl From<serde_json::error::Error> for AppError {
    fn from(err: serde_json::error::Error) -> Self {
        AppError::SerdeError(err)
    }
}

impl From<String> for AppError {
    fn from(msg: String) -> Self {
        AppError::Custom(msg)
    }
}

pub type Result<T> = std::result::Result<T, AppError>;
