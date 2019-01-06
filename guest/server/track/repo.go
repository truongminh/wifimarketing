package track

import "context"

type Repo interface {
	CreateSession(ctx context.Context, s Session) error
	PingSession(ctx context.Context, id string) error
}
